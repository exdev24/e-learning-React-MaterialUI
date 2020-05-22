import { UserModel } from 'models';
import { configureScope } from 'sentry';
import { NextFunction, Request, Response } from 'express';
import { routeIds } from '../../shared/constants';
import { Identity } from '../app';

const setSentryUser = (identity: Identity) => {
  configureScope(scope => {
    scope.setUser({
      id: identity.id,
      email: identity.email
    });
  });
};

export function setIdentity(req: Request, user: UserModel) {
  req.userId = user.id;
  delete req.session.ref;
  req.session.identity = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin
  };
  setSentryUser(req.session.identity);
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.session?.identity) {
    req.userId = req.session.identity.id;
    setSentryUser(req.session.identity);
  }

  next();
}

export function authWall(req: Request, res: Response, next: NextFunction) {
  if (req.userId) {
    return next();
  }

  res.redirect(routeIds.signin + '?next=' + encodeURIComponent(req.path));
}
