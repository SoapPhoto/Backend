import { IPaginationList } from './global';

export type TagEntity = import('@server/modules/tag/tag.entity').TagEntity;

export type GetTagPictureListDto =
  MutableRequired<Omit<import('@server/modules/tag/dto/tag.dto').GetTagPictureListDto, 'time'>>;

export interface ITagPictureListRequest extends IPaginationList {
  data: PictureEntity[];
}
