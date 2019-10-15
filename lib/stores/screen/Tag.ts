import { action, observable } from 'mobx';

import { TagEntity } from '@lib/common/interfaces/tag';
import { queryToMobxObservable } from '@lib/common/apollo';
import { Tag } from '@lib/schemas/query';
import { BaseStore } from '../base/BaseStore';

interface ITagGqlReq {
  tag: TagEntity;
}

export class TagScreenStore extends BaseStore {
  @observable public name!: string;

  @observable public info!: TagEntity;

  constructor() {
    super();
  }

  public getInfo = async (name: string) => {
    this.name = name;
    await queryToMobxObservable(this.client.watchQuery<ITagGqlReq>({
      query: Tag,
      variables: {
        name: decodeURI(name),
      },
      fetchPolicy: 'cache-and-network',
    }), (data) => {
      this.setInfo(data.tag);
    });
  }

  @action public setInfo = (data: TagEntity) => {
    this.info = data;
  }

  @action public getCache = async (name: string) => {
    try {
      const data = this.client.readQuery<ITagGqlReq>({
        query: Tag,
        variables: { name: decodeURI(name) },
      });
      if (data) {
        this.setInfo(data.tag);
      } else {
        throw new Error('No Cache');
      }
    } catch (err) {
      await this.getInfo(name);
    }
  }
}
