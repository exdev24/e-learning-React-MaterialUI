import { canonicalUrl } from 'cl-common';
import { PartnerModel, SubjectModel } from 'cl-models';
import { Application } from 'express';
import {
  EnumChangefreq,
  SitemapItemLoose,
  SitemapStream,
  streamToPromise
} from 'sitemap';
import { format } from 'url';
import { routeIds } from '../../shared/constants';

const knownLinks: SitemapItemLoose[] = [
  {
    url: canonicalUrl,
    priority: 1,
    changefreq: EnumChangefreq.WEEKLY
  },
  {
    url: canonicalUrl + routeIds.about,
    changefreq: EnumChangefreq.MONTHLY
  },
  {
    url: canonicalUrl + routeIds.catalog,
    changefreq: EnumChangefreq.MONTHLY
  },
  {
    url: canonicalUrl + routeIds.technews,
    changefreq: EnumChangefreq.DAILY
  },
  {
    url: canonicalUrl + routeIds.camp,
    changefreq: EnumChangefreq.WEEKLY
  },
  {
    url: canonicalUrl + routeIds.privacy,
    changefreq: EnumChangefreq.YEARLY,
    priority: 0.3
  },
  {
    url: canonicalUrl + routeIds.tos,
    changefreq: EnumChangefreq.YEARLY,
    priority: 0.3
  }
];

export function setupSiteMap(app: Application) {
  app.get('/sitemap.xml', async (req, res, next) => {
    try {
      const smStream = new SitemapStream({
        hostname: canonicalUrl,
        xmlns: {
          news: true,
          xhtml: true,
          image: true,
          video: true
        }
      });

      knownLinks.forEach(link => smStream.write(link));

      const subjects = await SubjectModel.findAll();
      for (const subject of subjects) {
        smStream.write({
          url: format({ host: canonicalUrl, pathname: subject.pathname }),
          changefreq: EnumChangefreq.WEEKLY,
          priority: 1,
          img: subject.thumbnail
        });
      }

      const partners = await PartnerModel.findAll();
      for (const partner of partners) {
        smStream.write({
          url: format({ host: canonicalUrl, pathname: '/partner/' + partner.code }),
          changefreq: EnumChangefreq.WEEKLY,
          priority: 1,
          img: partner.bannerImage
        });
      }

      smStream.end();

      const data = await streamToPromise(smStream);
      res.setHeader('Content-Type', 'application/xml');
      res.send(data.toString());
    } catch (err) {
      next(err);
    }
  });
}
