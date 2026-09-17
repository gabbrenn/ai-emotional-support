import { client } from '../src/db/index.js';

async function run() {
  console.log('Checking columns in users table...');
  const tableInfo = await client.execute('PRAGMA table_info(users);');
  const existingCols = new Set(tableInfo.rows.map((r: any) => r.name));
  console.log('Existing columns:', Array.from(existingCols));

  const additions = [
    { name: 'is_verified', sql: 'ALTER TABLE users ADD COLUMN is_verified INTEGER NOT NULL DEFAULT 0;' },
    { name: 'verification_token', sql: 'ALTER TABLE users ADD COLUMN verification_token TEXT;' },
    { name: 'verification_token_expires_at', sql: 'ALTER TABLE users ADD COLUMN verification_token_expires_at TEXT;' },
    { name: 'reset_password_token', sql: 'ALTER TABLE users ADD COLUMN reset_password_token TEXT;' },
    { name: 'reset_password_token_expires_at', sql: 'ALTER TABLE users ADD COLUMN reset_password_token_expires_at TEXT;' },
  ];

  for (const add of additions) {
    if (!existingCols.has(add.name)) {
      console.log(`Adding column: ${add.name}...`);
      await client.execute(add.sql);
      console.log(`Added ${add.name}`);
    } else {
      console.log(`Column ${add.name} already exists`);
    }
  }

  // Also ensure existing users (if any for testing) are verified or unverified as needed
  console.log('Migration completed successfully.');
  client.close();
}

run().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
