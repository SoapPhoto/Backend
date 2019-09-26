import ApolloClient from 'apollo-client/ApolloClient';
import { WatchQueryOptions, OperationVariables } from 'apollo-client';

export const watchQuery = <T = any, TVariables = OperationVariables>(
  client: ApolloClient<any>,
  query: WatchQueryOptions<TVariables>,
) => new Promise((resolve, reject) => {
  client.watchQuery<T, TVariables>(query)
    .subscribe({
      next: data => resolve(data),
    });
});
