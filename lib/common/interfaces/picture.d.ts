import { PaginationList } from './global';

export type PictureEntity = import('@server/picture/picture.entity').PictureEntity;

export interface IPictureListRequest extends PaginationList {
  data: PictureEntity[];
}

export type CreatePictureAddDot = import('@server/picture/dto/picture.dto').CreatePictureAddDot
