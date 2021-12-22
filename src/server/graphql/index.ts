import { captureException, withScope } from '@sentry/node';
import {
  ApolloServer,
  AuthenticationError,
  UserInputError
} from 'apollo-server-express';
import { UserModel } from 'cl-models';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from 'pino';
import { EmptyResultError, ValidationError } from 'sequelize';
import logger from '../lib/logger';
import resolvers from './resolvers';

const typeDefs = fs.readFileSync(path.resolve('api.graphql'), 'utf8');
const isDev = process.env.NODE_ENV !== 'production';

export class GraphqlContext {
  public readonly logger: Logger;
  public readonly req: Request;
  public userId: string;

  constructor(req: Request) {
    this.req = req;
    this.userId = req.session.identity?.id;

    this.logger = logger.child({
      userId: this.userId,
      requestId: req.get('X-Amz-Cf-Id')
    });
  }

  assertAuthenticated() {
    if (!this.userId) {
      this.unauthorized('Please login first');
    }
  }

  unauthorized(message: string) {
    throw new AuthenticationError(message);
  }

  badRequest(message: string, props = {}) {
    throw new UserInputError(message, props);
  }

  setIdentity(user: UserModel) {
    delete this.req.session.ref;
    this.userId = user.id;
    this.req.session.identity = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    };
  }
}

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: isDev,
  introspection: isDev,
  context(ctx) {
    return new GraphqlContext(ctx.req);
  },
  formatError(err) {
    let report = true;

    let extensions = {
      ...err.extensions
    };

    if (err.originalError instanceof ValidationError) {
      report = false;
      extensions = err.originalError.errors.reduce(
        (all, item) =>
          Object.assign(all, {
            [item.path]: item.message
          }),
        {}
      );
    }

    if (
      err.originalError instanceof UserInputError ||
      err.originalError instanceof AuthenticationError ||
      err.originalError instanceof EmptyResultError
    ) {
      report = false;
    }

    if (report) {
      logger.error(err, err.message);
      withScope(scope => {
        scope.setTag('GraphQLError', err.name);
        scope.setExtra('locations', err.path);
        scope.setExtra('path', err.path);
        scope.setExtras(extensions);
        captureException(err);
      });
    }

    return {
      extensions,
      locations: err.locations,
      message: err.message,
      path: err.path
    };
  }
});
