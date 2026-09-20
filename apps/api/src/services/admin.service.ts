import { eq, sql, or, like, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, conversations, moods } from '../db/schema.js';
import type { AdminStats, AdminUser, UserRole } from '@ai-esa/shared';

export class AdminService {
  /**
   * Retrieves high-level application statistics.
   * STRICT PRIVACY RULE: Only aggregate counts are returned.
   * No message content, AI answers, or mood notes are ever read or exposed.
   */
  async getStats(): Promise<AdminStats> {
    // 1. Total users
    const [userCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const totalUsers = Number(userCountResult?.count ?? 0);

    // 2. Total conversations
    const [convCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(conversations);
    const totalConversations = Number(convCountResult?.count ?? 0);

    // 3. Total mood check-ins
    const [moodCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(moods);
    const totalMoodCheckins = Number(moodCountResult?.count ?? 0);

    // 4. New users today (since start of day UTC)
    const [todayResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`datetime(${users.createdAt}) >= datetime('now', 'start of day')`);
    const newUsersToday = Number(todayResult?.count ?? 0);

    // 5. New users this week (past 7 days)
    const [weekResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`datetime(${users.createdAt}) >= datetime('now', '-7 days')`);
    const newUsersThisWeek = Number(weekResult?.count ?? 0);

    // 6. New users this month (past 30 days)
    const [monthResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`datetime(${users.createdAt}) >= datetime('now', '-30 days')`);
    const newUsersThisMonth = Number(monthResult?.count ?? 0);

    return {
      totalUsers,
      totalConversations,
      totalMoodCheckins,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
    };
  }

  /**
   * Retrieves safe user account summaries for administration.
   * STRICT PRIVACY RULE: Passwords, password hashes, chat messages, and notes
   * are completely excluded.
   */
  async getUsers(searchQuery?: string): Promise<AdminUser[]> {
    const trimmed = searchQuery?.trim();

    let query = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    if (trimmed && trimmed.length > 0) {
      const searchPattern = `%${trimmed.toLowerCase()}%`;
      const searchResults = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          isActive: users.isActive,
          isVerified: users.isVerified,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(
          or(
            like(sql`lower(${users.name})`, searchPattern),
            like(sql`lower(${users.email})`, searchPattern)
          )
        )
        .orderBy(desc(users.createdAt));

      return searchResults as AdminUser[];
    }

    const allUsers = await query.orderBy(desc(users.createdAt));
    return allUsers as AdminUser[];
  }

  /**
   * Updates a user's role (user <-> admin).
   * Guards against self-demotion or removal of the last admin.
   */
  async updateUserRole(
    adminUserId: number,
    targetUserId: number,
    newRole: UserRole
  ): Promise<AdminUser> {
    if (newRole !== 'user' && newRole !== 'admin') {
      const err = new Error('Invalid role specified. Must be "user" or "admin".') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    // Prevent admin from removing their own admin privilege
    if (adminUserId === targetUserId && newRole !== 'admin') {
      const err = new Error('Administrators cannot remove their own admin privileges.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    // If demoting an admin, ensure at least one other admin remains
    if (newRole === 'user') {
      const adminCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.role, 'admin'));

      if (Number(adminCount[0]?.count ?? 0) <= 1) {
        const [targetUser] = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, targetUserId))
          .limit(1);

        if (targetUser?.role === 'admin') {
          const err = new Error('Cannot demote the last administrator account.') as Error & { statusCode: number };
          err.statusCode = 400;
          throw err;
        }
      }
    }

    const [updated] = await db
      .update(users)
      .set({
        role: newRole,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, targetUserId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updated) {
      const err = new Error('User not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }

    return updated as AdminUser;
  }

  /**
   * Toggles active / inactive status of an account.
   * Guards against self-deactivation.
   */
  async updateUserStatus(
    adminUserId: number,
    targetUserId: number,
    isActive: boolean
  ): Promise<AdminUser> {
    if (adminUserId === targetUserId && !isActive) {
      const err = new Error('Administrators cannot deactivate their own account.') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }

    const [updated] = await db
      .update(users)
      .set({
        isActive,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(users.id, targetUserId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updated) {
      const err = new Error('User not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }

    return updated as AdminUser;
  }
}

export const adminService = new AdminService();
