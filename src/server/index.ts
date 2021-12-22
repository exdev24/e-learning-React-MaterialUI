import * as Sentry from '@sentry/node';
import { SubjectModel } from 'cl-models';
import config from 'config';
import cookieSession from 'cookie-session';
import express from 'express';
import helmet from 'helmet';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import { routeIds } from '../shared/constants';
import nextI18next from '../shared/i18n';
import serverRoutes from './handlers/routes';
import logger from './lib/logger';

const serverPort = config.get('server.port');

if (config.get('sentry.enabled')) {
  Sentry.init(config.get('sentry'));
}

const app = express();
const nextServer = next({ dev: process.env.NODE_ENV === 'development' });
const nextHandler = nextServer.getRequestHandler();

app.set('trust proxy', true);
app.set('port', serverPort);

app.all(/\.(js|json|png|jpg|jpeg|ico|xml)$/i, (req, res) => nextHandler(req, res));

app.use(Sentry.Handlers.requestHandler());
app.use(
  cookieSession({
    ...config.get('server.cookie'),
    keys: config.get('server.keys').split(',')
  })
);

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(Sentry.Handlers.errorHandler());

// routes
serverRoutes(app);

async function startServer() {
  await nextServer.prepare();

  await nextI18next.initPromise;
  app.use(nextI18NextMiddleware(nextI18next));

  const subjects = await SubjectModel.findAll();
  for (const subject of subjects) {
    if (subject.details.pathname) {
      app.get(subject.details.pathname, (req, res) => {
        nextServer.render(req, res, routeIds.topic, {
          ...req.query,
          id: subject.id
        });
      });
    }
  }

  app.get('*', (req, res) => nextHandler(req, res));

  app.listen(serverPort, (err: Error) => {
    if (err) {
      throw err;
    }

    logger.info(
      '🚀 started at http://localhost:%d in %s mode',
      serverPort,
      process.env.NODE_ENV
    );
  });
}

startServer().catch(err => {
  logger.error(err, 'fail to start server');
  Sentry.captureException(err);
  process.exit(1);
});
