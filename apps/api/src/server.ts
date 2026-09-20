import { buildApp } from './app.js';
import { config } from './config/index.js';
import { bootstrapAdmin } from './services/admin-bootstrap.service.js';

async function main() {
  try {
    await bootstrapAdmin();
  } catch (err: any) {
    console.error(`[admin-bootstrap] Fatal startup error: ${err?.message || err}`);
    process.exit(1);
  }

  const app = await buildApp();

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    app.log.info(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Server running on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
