import * as Sentry from '@sentry/node';
import { commonRoutes } from 'cl-common';
import { StudentModel } from 'cl-models';
import { Application } from 'express';
import basicAuth from 'express-basic-auth';
import Multer from 'multer';
import { routeIds } from '../../shared/constants';
import { apolloServer } from '../graphql';
import { partnerImportSchedules } from '../partners/import-schedules';
import partnerParseSchedulesFile from '../partners/parse-schedules-file';
import {
  handleRequestCertificate,
  handleRequestPrintCertificate
} from './certificates';
import { setupRedirections } from './redirections';
import { setupSiteMap } from './sitemap';

const upload = Multer({ storage: Multer.memoryStorage() });
const partnerAuth = basicAuth({
  challenge: true,
  users: {
    admin: 'duw8LidahPhah8feh3phaceahighoh',
    trusted: '$^B%wVoGUP92fx%NRiUe'
  }
});

export default (app: Application) => {
  setupSiteMap(app);
  setupRedirections(app);

  app.get('/health', (req, res) => {
    res.end('OK');
  });

  // logout
  app.get(routeIds.signout, (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  // graphql api
  apolloServer.applyMiddleware({
    app,
    path: commonRoutes.graphql,
    bodyParserConfig: {
      limit: '2048kb'
    }
  });

  handleRequestCertificate(app);
  handleRequestPrintCertificate(app);

  app.get('/optout/:id', async (req, res, next) => {
    const diff = {
      [`details.optIns.${req.params.id}`]: false
    };

    if (req.query.uid) {
      await StudentModel.update(diff, { where: { parentId: req.query.uid } });
    }

    if (req.query.sid) {
      await StudentModel.update(diff, { where: { id: req.query.sid } });
    }

    next();
  });

  app.get(
    '/partner-upload-schedules',
    partnerAuth,
    (req: basicAuth.IBasicAuthedRequest, res: any, next: any) => {
      if (req.auth) {
        return next();
      }

      res.send(401, 'Failed authorization');
    }
  );

  app.post(
    '/partner-handle-file-upload',
    partnerAuth,
    upload.single('sheet'),
    async (req, res) => {
      let error = '';
      try {
        const imported = await partnerParseSchedulesFile(req.file.buffer);
        await partnerImportSchedules(imported);
      } catch (err) {
        error = err.toString();
        Sentry.withScope(scope => {
          scope.addBreadcrumb({ message: 'fail to request certificate' });
          Sentry.captureException(err);
        });
      }

      res.redirect(
        '/partner-upload-schedules?' + (error ? `error=${error}` : 'success=true')
      );
    }
  );
};
