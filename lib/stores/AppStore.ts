import {
  action, observable, reaction, runInAction,
} from 'mobx';

import NProgress from 'nprogress';
import { CollectionEntity, ICollectionListRequest } from '@lib/common/interfaces/collection';
import { UserEntity } from '@lib/common/interfaces/user';
import { queryToMobxObservable } from '@lib/common/apollo';
import { ApolloClient } from 'apollo-boost';
import { UserCollectionsByName } from '@lib/schemas/query';
import { store } from './init';

export enum RouterAction {
  POP = 'POP',
  PUSH = 'PUSH',
  REPLACE = 'REPLACE',
}

interface ILocation {
  href: string;
  options?: {
    shallow?: boolean;
    [key: string]: any;
  };
  as: string;
  action: RouterAction;
}

export class AppStore {
  public client!: ApolloClient<any>;

  @observable public userCollection = observable.array<CollectionEntity>([])

  @observable public collectionLoading = true

  @observable public loading = false;

  @observable public location?: ILocation;

  @observable public userList: Map<string, UserEntity> = new Map();

  constructor() {
    reaction(
      () => this.loading,
      (loading: boolean) => {
        if (loading) {
          NProgress.start();
        } else {
          NProgress.done();
        }
      },
    );
  }

  public setClient = (client: ApolloClient<any>) => this.client = client;

  @action
  public setLoading = (value: boolean) => this.loading = value

  @action
  public setRoute = (value: ILocation) => {
    this.location = value;
  }

  @action
  public getCollection = async () => {
    const { accountStore } = store;
    if (accountStore.userInfo) {
      await queryToMobxObservable(this.client.watchQuery<{userCollectionsByName: ICollectionListRequest}>({
        query: UserCollectionsByName,
        variables: {
          username: accountStore.userInfo.username,
        },
        fetchPolicy: 'cache-and-network',
      }), (data) => {
        runInAction(() => {
          this.userCollection.replace(data.userCollectionsByName.data);
          this.collectionLoading = false;
        });
      });
      // const { data } = await getUserCollection(accountStore.userInfo.username);
      // runInAction(() => this.userCollection.replace(data.data));
    }
  }

  @action public addCollection = (data: CollectionEntity) => this.userCollection.unshift(data)
}
