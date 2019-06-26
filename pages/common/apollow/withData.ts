import ApolloClient from 'apollo-boost';
import withApollo from 'next-with-apollo';

function createClient({ headers }: any) {
  return new ApolloClient({
    uri: `${process.env.URL}/graphql`,
    request: (operation) => {
      operation.setContext({
        headers,
        fetchOptions: {
          credentials: 'include',
        },
      });
    },
  });
}

export default withApollo(createClient);
