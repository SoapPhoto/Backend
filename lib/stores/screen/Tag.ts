import { action, observable } from 'mobx';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { GetTagPictureListDto, ITagPictureListRequest, TagEntity } from '@lib/common/interfaces/tag';
import { likePicture } from '@lib/services/picture';
import { tagInfo, tagPictureList } from '@lib/services/tag';
import { ListStore } from '../base/ListStore';

export class TagScreenStore extends ListStore<PictureEntity, GetTagPictureListDto> {
  @observable public name!: string;
  @observable public info!: TagEntity;

  constructor() {
    super();
    this.initQuery();
  }

  public getInit = async (name: string, headers?: any) => {
    this.name = name;
    await Promise.all([this.getInfo(headers), this.getList(headers)]);
  }

  @action public getInfo = async (headers?: any) => {
    const { data } = await tagInfo(this.name, headers);
    this.info = data;
  }

  @action public getList = async (headers?: any, plus = false) => {
    const { data } = await tagPictureList(this.name, this.listQuery, headers);
    this.init = true;
    this.setData(data, plus);
  }
  @action
  public getPageList = async() => {
    const page = this.listQuery.page + 1;
    if (page > this.maxPage) {
      return;
    }
    // tslint:disable-next-line: no-increment-decrement
    this.listQuery.page++;
    return this.getList(undefined, true);
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
      pageSize: Number(process.env.LIST_PAGE_SIZE),
      timestamp: Number(Date.parse(new Date().toISOString())),
    };
  }
  @action
  public like = async (data: PictureEntity) => {
    const oldData = data.isLike;
    data.isLike = !data.isLike;
    try {
      await likePicture(data.id);
    } catch (err) {
      data.isLike = oldData;
      console.error(err);
    }
  }
}
