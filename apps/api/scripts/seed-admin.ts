import { bootstrapAdmin } from '../src/services/admin-bootstrap.service.js';
import { client } from '../src/db/index.js';

async function run() {
  try {
    await bootstrapAdmin();
    console.log('[seed-admin] Completed.');
  } catch (err: any) {
    console.error('[seed-admin] Error:', err?.message || err);
    process.exit(1);
  } finally {
    client.close();
  }
}

run();
