import { InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';
import withData from 'next-with-apollo';
import { onError } from 'apollo-link-error';
import cookie from 'js-cookie';

import { getMainDefinition } from 'apollo-utilities';
import { server } from '../utils';

function createClient({ headers, initialState }: any) {
  const URL = `${(server && process.env.NODE_ENV === 'production') ? 'http://127.0.0.1:3001' : process.env.API_URL}/graphql`;
  const ssrMode = !(process as any).browser;

  const httpLink = new BatchHttpLink({
    uri: URL,
    credentials: 'include',
  });

  const contextLink = setContext(
    async () => ({
      headers: {
        accept: 'application/json',
        ...headers,
      },
    }),
  );

  const errorLink = onError(
    ({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(err => console.error(`[GraphQL error]: Message: ${(err.message as any)?.error?.toString()}`));
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    },
  );

  const wsLink = !ssrMode ? new WebSocketLink({
    uri: `${process.env.WS_URL}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: cookie.get().Authorization,
        ...headers,
      },
    },
  }) : () => {
    console.log('SSR');
  };

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
      );
    },
    wsLink as any,
    httpLink,
  );

  const link = ApolloLink.from([
    errorLink,
    contextLink,
    splitLink,
  ]);
  return new ApolloClient({
    link,
    ssrMode,
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export const withApollo = withData(createClient, {
  getDataFromTree: 'ssr',
});
