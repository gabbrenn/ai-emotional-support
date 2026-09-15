import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { config } from '../config/index.js';
import * as schema from './schema.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

const rawDbPath = path.isAbsolute(config.databaseUrl)
  ? config.databaseUrl
  : path.resolve(projectRoot, config.databaseUrl);

// Ensure the data directory exists
mkdirSync(path.dirname(rawDbPath), { recursive: true });

// Convert file path to file: URI format required by @libsql/client
const dbUrl = `file:${rawDbPath.replace(/\\/g, '/')}`;

export const client = createClient({ url: dbUrl });
export const db = drizzle(client, { schema });
