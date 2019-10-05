import { IPaginationList } from './global';

export type PictureEntity = import('@server/modules/picture/picture.entity').PictureEntity;

export type IPictureListRequest = IPaginationList<PictureEntity>;

export type CreatePictureAddDot = import('@server/modules/picture/dto/picture.dto').CreatePictureAddDot

export type UpdatePictureDot = import('@server/modules/picture/dto/picture.dto').UpdatePictureDot;

export interface IPictureLikeRequest {
  count: number;
  isLike: boolean;
}
