import { z } from 'zod';

export const adminUsersQuerySchema = z.object({
  search: z.string().optional(),
});

export const adminUpdateRoleSchema = z.object({
  role: z.enum(['user', 'admin'], {
    errorMap: () => ({ message: 'Role must be either "user" or "admin"' }),
  }),
});

export const adminUpdateStatusSchema = z.object({
  isActive: z.boolean({
    required_error: 'isActive is required and must be a boolean',
  }),
});

export const adminUserParamsSchema = z.object({
  id: z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      throw new Error('Invalid user ID');
    }
    return num;
  }),
});
