import ApolloClient, { InMemoryCache } from 'apollo-boost';
import withData from 'next-with-apollo';

function createClient({ headers, initialState }: any) {
  return new ApolloClient({
    uri: `${process.env.URL}/graphql`,
    cache: new InMemoryCache().restore(initialState || {}),
    request: (operation) => {
      operation.setContext({
        headers: {
          accept: 'application/json',
          ...headers,
        },
      });
    },
    ...{
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    } as any,
  });
}

export const withApollo = withData(createClient, {
  getDataFromTree: 'ssr',
});
