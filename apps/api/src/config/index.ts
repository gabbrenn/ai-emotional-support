import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL ?? './data/app.db',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? '',
  openRouterModel: process.env.OPENROUTER_MODEL ?? 'openrouter/free',
} as const;
