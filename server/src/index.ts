import { createServer } from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './services/prisma';
import { logger } from './utils/logger';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
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
