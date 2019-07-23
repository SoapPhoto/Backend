import { PaginationList } from './global';

import { MutableRequired } from '@typings/types';

export type TagEntity = import('@server/tag/tag.entity').TagEntity;

export type GetTagPictureListDto = MutableRequired<Omit<import('@server/tag/dto/tag.dto').GetTagPictureListDto, 'time'>>;

export interface ITagPictureListRequest extends PaginationList {
  data: PictureEntity[];
}
