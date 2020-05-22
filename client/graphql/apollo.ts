import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient, ApolloError } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { commonRoutes } from 'common';
import { IncomingHttpHeaders } from 'http';
import isBrowser from 'is-browser';
import { serverPort } from '../runtime';

let apolloClient: ApolloClient<any>;

export function getApolloClient(initialState = {}, headers?: IncomingHttpHeaders) {
  if (!isBrowser) {
    return createApolloClient(initialState, headers);
  }

  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

export function createApolloClient(
  initialState: any,
  headers?: IncomingHttpHeaders
) {
  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        course: (_, args, { getCacheKey }) =>
          getCacheKey({
            __typename: 'Course',
            id: args.id
          }),
        subject: (_, args, { getCacheKey }) =>
          getCacheKey({
            __typename: 'Subject',
            id: args.id
          })
      }
    }
  });

  if (initialState) {
    cache.restore(initialState);
  }

  if (isBrowser) {
    return new ApolloClient({
      cache,
      link: new HttpLink({
        uri: commonRoutes.graphql,
        fetchOptions: {
          credentials: 'same-origin'
        }
      })
    });
  }

  const serverUrl = 'http://localhost:' + serverPort;

  return new ApolloClient({
    cache,
    ssrMode: true,
    link: new HttpLink({
      uri: serverUrl + commonRoutes.graphql,
      headers: headers && {
        cookie: headers['cookie']
      }
    })
  });
}

export function parseErrorMessage(err: ApolloError | Error) {
  if (err instanceof ApolloError) {
    if (err.networkError) {
      return err.networkError.message;
    }

    if (err.graphQLErrors.length > 0) {
      return err.graphQLErrors[0].message;
    }
  }

  return err.message;
}

export function transformGraphqlError(err: ApolloError) {
  return {
    message: parseErrorMessage(err),
    details: err.graphQLErrors.reduce(
      (result, error) => Object.assign(result, error.extensions),
      {}
    )
  };
}
