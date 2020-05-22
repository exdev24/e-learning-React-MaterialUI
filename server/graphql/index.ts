import Boom from 'boom';
import { captureException } from 'sentry';
import graphqlHTTP from 'express-graphql';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import get from 'lodash/get';
import * as path from 'path';
import { EmptyResultError, ValidationError } from 'sequelize';
import logger from '../lib/logger';
import resolvers from './resolvers';

const typeDefs = fs.readFileSync(path.resolve('api.graphql'), 'utf8');

const apiSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export const apiHandler = graphqlHTTP({
  schema: apiSchema,
  graphiql: process.env.NODE_ENV !== 'production',
  customFormatErrorFn(err) {
    let shouldReport = true;

    const extensions = err.extensions || {};

    if (err.originalError) {
      if (Boom.isBoom(err.originalError)) {
        Object.assign(extensions, err.originalError.data);
        const statusCode = get(err.originalError, 'output.statusCode');
        if (statusCode === 400 || statusCode === 401) {
          shouldReport = false;
        }
      } else if (err.originalError instanceof EmptyResultError) {
        err.message = 'Resource not found';
        shouldReport = false;
      } else if (err.originalError instanceof ValidationError) {
        err.originalError.errors.forEach(ve => {
          extensions[ve.path] = ve.message;
        });
        shouldReport = false;
      }
    }

    if (shouldReport) {
      logger.error({ error: err.originalError }, '[GraphQLError] %s', err.message);
      captureException(err.originalError || err);
    }

    return {
      extensions,
      message: err.message,
      locations: err.locations,
      path: err.path
    };
  }
});
