import { z } from 'zod';

export const createMoodSchema = z.object({
  mood: z
    .number({ invalid_type_error: 'Mood must be a number' })
    .int('Mood must be a whole number')
    .min(1, 'Mood must be between 1 and 5')
    .max(5, 'Mood must be between 1 and 5'),
  note: z
    .string()
    .max(500, 'Your note must be 500 characters or less')
    .optional()
    .transform((v) => (v ? v.trim() : undefined)),
});
