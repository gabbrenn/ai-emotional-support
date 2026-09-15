import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { config } from '../config/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

const rawDbPath = path.isAbsolute(config.databaseUrl)
  ? config.databaseUrl
  : path.resolve(projectRoot, config.databaseUrl);

const migrationsFolder = path.resolve(__dirname, '../../drizzle');

console.log(`[migrate] Database: ${rawDbPath}`);
console.log(`[migrate] Migrations folder: ${migrationsFolder}`);

mkdirSync(path.dirname(rawDbPath), { recursive: true });

const dbUrl = `file:${rawDbPath.replace(/\\/g, '/')}`;
const client = createClient({ url: dbUrl });
const db = drizzle(client);

await migrate(db, { migrationsFolder });

console.log('[migrate] ✓ Migrations applied successfully');
client.close();
