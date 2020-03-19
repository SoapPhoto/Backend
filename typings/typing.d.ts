/* eslint-disable import/no-duplicates */
/* eslint-disable import/newline-after-import */

declare module 'oauth2-server';
declare module 'oauth2-server/lib/handlers/token-handler';

declare module 'react-simple-img';

declare module 'react-keydown';

declare module 'zooming';

declare module 'socks-proxy-agent';

declare module 'rate-limit-redis';

declare module 'cache-manager-redis-store';

declare module 'socks5-https-client/lib/Agent';

declare module 'jsonp-get';

declare module '@mapbox/mapbox-gl-language';

declare module 'rc-animate';

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*/query.graphql' {
  import { DocumentNode } from 'graphql';

  export const Picture: DocumentNode;
  export const Pictures: DocumentNode;
  export const NewPictures: DocumentNode;
  export const UserInfo: DocumentNode;
  export const UserPictures: DocumentNode;
  export const UserCollectionsByName: DocumentNode;
  export const UpdatePicture: DocumentNode;
  export const Whoami: DocumentNode;
  export const Collection: DocumentNode;
  export const CollectionPictures: DocumentNode;
  export const Tag: DocumentNode;
  export const TagPictures: DocumentNode;
  export const UserNotification: DocumentNode;
  export const UnreadNotificationCount: DocumentNode;
  export const Comments: DocumentNode;
  export const ChildComments: DocumentNode;
  export const UserIsFollowing: DocumentNode;
  export const SearchPictures: DocumentNode;
  export const FollowedUsers: DocumentNode;
  export const FollowerUsers: DocumentNode;
  export const ReverseGeocoding: DocumentNode;
  export const SearchPlace: DocumentNode;
}
declare module '*/mutations.graphql' {
  import { DocumentNode } from 'graphql';

  export const UpdatePicture: DocumentNode;
  export const LikePicture: DocumentNode;
  export const UnLikePicture: DocumentNode;
  export const MarkNotificationReadAll: DocumentNode;
  export const AddPictureCollection: DocumentNode;
  export const RemovePictureCollection: DocumentNode;
  export const DeleteCollection: DocumentNode;
  export const UpdateProfile: DocumentNode;
  export const AddComment: DocumentNode;
  export const FollowUser: DocumentNode;
  export const UnFollowUser: DocumentNode;
}
declare module '*/subscription.graphql' {
  import { DocumentNode } from 'graphql';

  export const NewNotification: DocumentNode;
}

declare module '*/fragments.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export default value;
}
