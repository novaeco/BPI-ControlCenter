import { createServer } from 'http';
import { createApp } from './app.js';
import { env } from './config/env';
import { initDatabase } from './models';
import { logger } from './utils/logger';

const bootstrap = async (): Promise<void> => {
  await initDatabase();
  const app = createApp();
  const server = createServer(app);

  server.listen(env.PORT, () => {
    logger.info(`Serveur API démarré sur le port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Impossible de démarrer le serveur');
  process.exit(1);
});
