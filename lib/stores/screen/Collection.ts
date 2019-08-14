import { observable, action } from 'mobx';

import { CollectionEntity } from '@lib/common/interfaces/collection';
import { getCollectionInfo } from '@lib/services/collection';
import { BaseStore } from '../base/BaseStore';

export class CollectionScreenStore extends BaseStore {
  @observable public info?: CollectionEntity;

  public getInfo = async (id: string, headers?: any) => {
    const { data } = await getCollectionInfo(id, headers);
    this.setInfo(data);
    return '';
  }

  @action
  public setInfo = (data: CollectionEntity) => {
    this.info = data;
  }
}
