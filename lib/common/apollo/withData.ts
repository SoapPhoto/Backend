import ApolloClient, { InMemoryCache } from 'apollo-boost';
import withData from 'next-with-apollo';
import { server } from '../utils';

function createClient({ headers, initialState }: any) {
  return new ApolloClient({
    uri: `${(server && process.env.NODE_ENV === 'production') ? 'http://127.0.0.1:3001' : process.env.URL}/graphql`,
    cache: new InMemoryCache().restore(initialState || {}),
    request: (operation) => {
      operation.setContext({
        headers: {
          accept: 'application/json',
          ...headers,
        },
      });
    },
  });
}

export const withApollo = withData(createClient, {
  getDataFromTree: 'ssr',
});
