import { IPaginationList } from './global';

export type PictureEntity = import('@server/modules/picture/picture.entity').PictureEntity;

export interface IPictureListRequest extends IPaginationList {
  data: PictureEntity[];
}

export type CreatePictureAddDot = import('@server/modules/picture/dto/picture.dto').CreatePictureAddDot
