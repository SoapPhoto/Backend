import ApolloClient from 'apollo-client/ApolloClient';
import {
  WatchQueryOptions, OperationVariables, ApolloQueryResult, ObservableQuery,
} from 'apollo-client';
import { fromResource } from 'mobx-utils';
import {
  observable, reaction, IReactionDisposer,
} from 'mobx';

export const watchQuery = <T = any, TVariables = OperationVariables>(
  client: ApolloClient<any>,
  query: WatchQueryOptions<TVariables>,
): Promise<ApolloQueryResult<T>> => new Promise((resolve, reject) => client.watchQuery<T, TVariables>(query)
  .subscribe({
    next: (data) => {
      if (query.fetchPolicy === 'cache-and-network' && data.data !== undefined) {
        resolve(data);
      } else if (!data.loading) {
        resolve(data);
      }
    },
    error: error => reject(error),
  }));

export const queryToMobxObservable = <T = any, TVariables = OperationVariables>(
  queryObservable: ObservableQuery<T, TVariables>,
  cb: (data: T, clear: IReactionDisposer) => void,
  options?: { observable?: boolean },
): Promise<[T, IReactionDisposer]> => new Promise((resolve, reject) => {
  let subscription: ZenObservable.Subscription;
  const sub = fromResource<ApolloQueryResult<T>>(
    (sink) => {
      subscription = queryObservable.subscribe({
        next: (data) => {
          if (data) {
            sink(observable(data));
          } else {
            // sink(observable.box(data));
          }
        },
        error: reject,
      });
    },
    () => subscription!.unsubscribe(),
  );
  const clear = reaction(() => sub.current(), (info) => {
    if (!options?.observable && info.networkStatus === 7) clear();
    if (info.data) {
      cb(info.data, clear);
      resolve([info.data, clear]);
    }
  });
});

/**
 * 监听缓存变化
 *
 * @template T
 * @template TVariables
 * @param {ObservableQuery<T, TVariables>} queryObservable
 * @param {(data: T, clear: IReactionDisposer) => void} cb
 * @param {{ observable?: boolean }} [options]
 * @returns {IReactionDisposer}
 */
export const watchQueryCacheObservable = <T = any, TVariables = OperationVariables>(
  // eslint-disable-next-line arrow-parens
  queryObservable: ObservableQuery<T, TVariables>,
  cb: (data: T, clear: IReactionDisposer) => void,
  options?: { observable?: boolean },
): IReactionDisposer => {
  let subscription: ZenObservable.Subscription;
  const sub = fromResource<ApolloQueryResult<T>>(
    (sink) => {
      subscription = queryObservable.subscribe({
        next: (data) => {
          if (data) {
            sink(observable(data));
          } else {
            // sink(observable.box(data));
          }
        },
        error: console.error,
      });
    },
    () => subscription!.unsubscribe(),
  );
  const clear = reaction(() => sub.current(), (info) => {
    if (!options?.observable && info.networkStatus === 7) clear();
    if (info.data) {
      cb(info.data, clear);
    }
  });
  return clear;
};
