import { db } from '../db/index.js';
import { moods } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

/** Map integer score 1-5 → legacy text mood for the text column */
function scoreToMoodText(score: number): 'terrible' | 'bad' | 'okay' | 'good' | 'great' {
  switch (score) {
    case 1: return 'terrible';
    case 2: return 'bad';
    case 3: return 'okay';
    case 4: return 'good';
    case 5: return 'great';
    default: return 'okay';
  }
}

export async function createMood(
  userId: number,
  moodScore: number,
  note?: string,
) {
  const result = await db
    .insert(moods)
    .values({
      userId,
      mood: scoreToMoodText(moodScore),
      moodScore,
      note: note ?? null,
    })
    .returning();
  return result[0];
}

export async function getMoodsByUser(userId: number, limit = 30) {
  return db
    .select()
    .from(moods)
    .where(eq(moods.userId, userId))
    .orderBy(desc(moods.createdAt))
    .limit(limit);
}

/**
 * Returns today's mood entry for the user based on UTC date (consistent with SQLite's datetime('now')).
 */
export async function getTodayMood(userId: number) {
  const allMoods = await getMoodsByUser(userId, 10);
  const todayUtc = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  return allMoods.find((m) => m.createdAt.slice(0, 10) === todayUtc) ?? null;
}
