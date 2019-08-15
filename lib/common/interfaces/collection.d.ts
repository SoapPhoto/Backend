
export type CollectionEntity = import('@server/modules/collection/collection.entity').CollectionEntity;

export type ICollectionListRequest = IPaginationList<CollectionEntity>;

export type CreateCollectionDot = import('@server/modules/collection/dto/collection.dto').CreateCollectionDot;
