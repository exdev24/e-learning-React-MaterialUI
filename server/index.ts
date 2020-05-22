import { topicRoutes } from 'common';
import { captureException, Handlers, init as initSentry } from 'sentry';
import config from 'config';
import cookieSession from 'cookie-session';
import express from 'express';
import helmet from 'helmet';
import next from 'next';
import nextI18NextMiddleware from 'next-i18next/middleware';
import { routeIds, routePrefixes } from '../shared/constants';
import nextI18next from '../shared/i18n';
import { cacheWarmup } from './lib/catalog-cache';
import logger from './lib/logger';
import { authMiddleware } from './middlewares/auth';
import serverRoutes from './routes';

global['fetch'] = require('node-fetch');

const serverPort = config.get('server.port');
const env = process.env.NODE_ENV || 'development';

if (config.get('sentry.enabled')) {
  initSentry(config.get('sentry'));
}

const app = express();
const nextApp = next({ dev: env === 'development' });
const nextHandler = nextApp.getRequestHandler();

app.set('trust proxy', true);
app.set('port', serverPort);

app.use(Handlers.requestHandler());
app.use(nextI18NextMiddleware(nextI18next));
app.use(
  cookieSession({
    ...config.get('server.cookie'),
    keys: config.get('server.keys').split(',')
  })
);

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(authMiddleware);

// error handlers
app.use(Handlers.errorHandler());

// redirection
serverRoutes(app);

nextApp.prepare().then(onServer);

async function onServer() {
  try {
    await nextI18next.initPromise;
    await cacheWarmup();
  } catch (err) {
    logger.error(err, 'fail to connect to db');
    captureException(err);
    throw err;
  }

  // nextjs
  Object.keys(topicRoutes).forEach(subjectId => {
    if (topicRoutes[subjectId]) {
      app.get(topicRoutes[subjectId], (req, res) =>
        nextApp.render(req, res, routeIds.topic, {
          id: subjectId
        })
      );
    }
  });

  app.get(routePrefixes.ref + ':ref', (req, res) => nextHandler(req, res));
  app.get('*', (req, res) => nextHandler(req, res));

  app.listen(serverPort, (err: Error) => {
    if (err) {
      logger.error(err, 'fail to start server');
      captureException(err);
      throw err;
    }

    logger.info('🚀 started at http://localhost:%d in %s mode', serverPort, env);
  });
}
