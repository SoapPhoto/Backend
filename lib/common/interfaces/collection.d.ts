
export type CollectionEntity = import('@server/modules/collection/collection.entity').CollectionEntity;

export type ICollectionListRequest = IPaginationList<CollectionEntity>;

export type CreateCollectionDot = import('@server/modules/collection/dto/collection.dto').CreateCollectionDot;

export type UpdateCollectionDot = import('@server/modules/collection/dto/collection.dto').UpdateCollectionDot;

export type GetCollectionPictureListDto = MutableRequired<
Omit<import('@server/modules/collection/dto/collection.dto').GetCollectionPictureListDto, 'time'>
>;
