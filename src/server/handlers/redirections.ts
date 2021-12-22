import { Application } from 'express';
import { Pdfs, routeIds, routePrefixes } from '../../shared/constants';

const redirectUrls: [string, string][] = [
  ['/science-news', routeIds.technews],
  ['/express', routeIds.vschool],
  ['/2020', routeIds.vschool],
  ['/smember', routeIds.vschool],
  ['/slearn', routeIds.vschool],
  ['/catalog2020', routeIds.catalog],
  ['/admin(/*)?', 'https://ops.create-learn.com'],
  ['/catalog.pdf', Pdfs.Catalog2020],
  ['/teacher-brochure.pdf', Pdfs.TeacherBrochure],
  ['/teacher-catalog.pdf', Pdfs.TeacherCatalog]
];

const protectedUrls = [
  routeIds.account,
  routeIds.payments,
  routeIds.refer,
  routePrefixes.enrollClass + '*',
  routePrefixes.enrollPackage + '*',
  routePrefixes.myClasses + '*',
  routePrefixes.myProjects + '*'
];

export function setupRedirections(app: Application) {
  redirectUrls.forEach(urls => {
    app.get(urls[0], (req, res) => {
      res.redirect(urls[1]);
    });
  });

  protectedUrls.forEach(url => {
    app.get(url, (req, res, next) => {
      if (req.session && req.session.identity) {
        return next();
      }

      res.redirect(routeIds.signup + '?next=' + encodeURIComponent(req.path));
    });
  });
}
