import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { config } from '../config/index.js';
import { hashPassword } from '../utils/password.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Ensures that at least one administrator account exists in the database.
 * Executes on API server startup before requests are accepted.
 */
export async function bootstrapAdmin(): Promise<void> {
  // 1. Check whether an administrator already exists
  const existingAdmins = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1);

  if (existingAdmins.length > 0) {
    console.log('[admin-bootstrap] Existing administrator detected.');
    return;
  }

  console.log('[admin-bootstrap] No administrator found.');
  console.log('[admin-bootstrap] Creating initial administrator...');

  const adminName = config.adminName?.trim();
  const adminEmail = config.adminEmail?.toLowerCase().trim();
  const adminPassword = config.adminPassword;

  // 2. Validate configuration presence
  if (!adminPassword || adminPassword.trim() === '') {
    throw new Error(
      'Admin account does not exist and ADMIN_PASSWORD is not configured. ' +
      'Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before starting the API.'
    );
  }

  if (!adminName) {
    throw new Error(
      'Admin account does not exist and ADMIN_NAME is not configured. ' +
      'Set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD before starting the API.'
    );
  }

  if (!adminEmail || !EMAIL_REGEX.test(adminEmail)) {
    throw new Error(
      `Admin account does not exist and ADMIN_EMAIL is invalid: "${adminEmail}". ` +
      'Provide a valid email address before starting the API.'
    );
  }

  // 3. Prevent silent promotion of existing normal user
  const existingUserWithEmail = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (existingUserWithEmail.length > 0) {
    throw new Error(
      `[admin-bootstrap] Configuration error: Configured ADMIN_EMAIL "${adminEmail}" ` +
      'is already registered as a normal user. To protect user roles, automatic promotion is disabled. ' +
      'Please configure a different admin email or manage the account role explicitly.'
    );
  }

  // 4. Hash password with existing scrypt implementation
  const passwordHash = await hashPassword(adminPassword);

  // 5. Create initial administrator
  await db.insert(users).values({
    name: adminName,
    email: adminEmail,
    passwordHash,
    role: 'admin',
    isActive: true,
    isVerified: true,
  });

  console.log('[admin-bootstrap] Admin account initialized successfully.');
}
