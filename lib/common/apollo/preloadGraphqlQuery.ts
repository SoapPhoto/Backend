import ApolloClient, { OperationVariables, QueryOptions } from 'apollo-client';

export const preloadGraphqlQuery = async <T = any, TVariables = OperationVariables>(
  // eslint-disable-next-line arrow-parens
  apolloClient: ApolloClient<any>,
  options: QueryOptions<TVariables>,
): Promise<void> => {
  if (typeof window !== 'undefined') {
    await apolloClient.query(options);
  }
};
