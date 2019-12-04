import { useApolloClient, OperationVariables } from 'react-apollo';
import { DocumentNode } from 'graphql';

import { useCallback } from 'react';
import { queryToMobxObservable } from '../apollo';

type ReturnType<T> = [(callback: (data: T) => void, variables?: Record<string, any> | undefined) => void]

export function useWatchQuery<T>(query: DocumentNode): ReturnType<T> {
  const { watchQuery } = useApolloClient();
  const target = useCallback((callback: (data: T) => void, variables?: OperationVariables) => {
    queryToMobxObservable(watchQuery<T>({
      query,
      fetchPolicy: 'cache-and-network',
      variables,
    }), callback);
  }, [query, watchQuery]);
  return [target];
}
