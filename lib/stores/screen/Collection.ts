import {
  observable, action,
} from 'mobx';

import { CollectionEntity, UpdateCollectionDot } from '@lib/common/interfaces/collection';
import { IPictureListRequest } from '@lib/common/interfaces/picture';
import { queryToMobxObservable } from '@lib/common/apollo';
import { Collection } from '@lib/schemas/query';
import { updateCollection } from '@lib/services/collection';
import { BaseStore } from '../base/BaseStore';

interface ICollectionInfoGqlReq {
  collection: CollectionEntity;
}

export class CollectionScreenStore extends BaseStore {
  public _infoCache: Record<string, CollectionEntity> = {}

  public _pictureListCache: Record<string, IPictureListRequest> = {}

  @observable public id = '';

  @observable public info?: CollectionEntity;

  public updateCollection = async (value: UpdateCollectionDot) => {
    await updateCollection(this.id, value);
  }

  public getInfo = async (id: string) => {
    this.id = id;
    await queryToMobxObservable(this.client.watchQuery<ICollectionInfoGqlReq>({
      query: Collection,
      variables: {
        id,
      },
      fetchPolicy: 'cache-and-network',
    }), ({ collection }) => {
      this.setInfo(collection);
    });
  }

  @action public setInfo = (data: CollectionEntity) => {
    this.info = data;
  }

  @action public getCache = async (id: string) => {
    try {
      const data = this.client.readQuery<ICollectionInfoGqlReq>({
        query: Collection,
        variables: { id },
      });
      if (data) {
        this.setInfo(data.collection);
      } else {
        throw new Error('No Cache');
      }
    } catch (err) {
      await this.getInfo(id);
    }
  }
}
