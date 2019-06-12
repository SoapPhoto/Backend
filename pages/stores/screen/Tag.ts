import { action, observable } from 'mobx';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { GetTagPictureListDto, ITagPictureListRequest, TagEntity } from '@pages/common/interfaces/tag';
import { tagInfo, tagPictureList } from '@pages/services/tag';
import { ListStore } from '../base/ListStore';

export class TagScreenStore extends ListStore<PictureEntity, GetTagPictureListDto> {
  @observable public info!: TagEntity;

  constructor() {
    super();
    this.initQuery();
  }

  public getInit = async (name: string, headers?: any) => {
    await Promise.all([this.getInfo(name, headers), this.getList(name, headers)]);
  }

  @action public getInfo = async (name: string, headers?: any) => {
    const { data } = await tagInfo(name, headers);
    this.info = data;
  }

  @action public getList = async (name: string, headers?: any) => {
    const { data } = await tagPictureList(name, this.listQuery, headers);
    console.log(data);
    this.setData(data, false);
  }

  @action public setData = (data: ITagPictureListRequest, plus: boolean) => {
    if (plus) {
      this.list = this.list.concat(data.data);
    } else {
      this.list = data.data;
    }
    this.listQuery.page = data.page;
    this.listQuery.pageSize = data.pageSize;
    this.listQuery.timestamp = data.timestamp;
    this.count = data.count;
  }

  @action public initQuery = () => {
    this.listQuery = {
      page: 1,
      pageSize: 30,
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }

}
