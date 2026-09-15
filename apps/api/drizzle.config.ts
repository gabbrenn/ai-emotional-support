import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import path from 'path';

const databaseUrl = process.env.DATABASE_URL ?? './data/app.db';

// Resolve relative to the repo root (two levels up from apps/api)
const dbPath = path.isAbsolute(databaseUrl)
  ? databaseUrl
  : path.resolve(process.cwd(), '../../', databaseUrl);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: dbPath,
  },
});
