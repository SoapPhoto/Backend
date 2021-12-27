/// <reference types="../typings/index" />
/// <reference types="../typings/typing" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {} from '../env';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { UserEntity } from './modules/user/user.entity';
import { PictureEntity } from './modules/picture/picture.entity';
import { ClientEntity } from './modules/oauth/client/client.entity';
import { PictureUserActivityEntity } from './modules/picture/user-activity/user-activity.entity';
import { NotificationEntity } from './modules/notification/notification.entity';
import { NotificationSubscribersUserEntity } from './modules/notification/subscribers-user/subscribers-user.entity';
import { TagEntity } from './modules/tag/tag.entity';
import { AccessTokenEntity } from './modules/oauth/access-token/access-token.entity';
import { CollectionEntity } from './modules/collection/collection.entity';
import { CollectionPictureEntity } from './modules/collection/picture/collection-picture.entity';
import { CommentEntity } from './modules/comment/comment.entity';
import { FileEntity } from './modules/file/file.entity';
import { CredentialsEntity } from './modules/credentials/credentials.entity';
import { FollowEntity } from './modules/follow/follow.entity';
import { BadgeEntity } from './modules/badge/badge.entity';
import { PictureBadgeActivityEntity } from './modules/badge/picture-badge-activity/picture-badge-activity.entity';
import { UserBadgeActivityEntity } from './modules/badge/user-badge-activity/user-badge-activity.entity';
import { InviteEntity } from './modules/invite/invite.entity';
import { LocationEntity } from './modules/location/location.entity';
// import { PictureMarkEntity } from './modules/picture/mark/mark.entity';

const ormconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  port: Number(process.env.DATABASE_PORT),
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV !== 'production', // TODO: Remove in production!
  // migrationsRun: true,
  logging: process.env.NODE_ENV !== 'production',
  logger: 'file',
  keepConnectionAlive: true,
  entities: [
    UserEntity,
    PictureEntity,
    ClientEntity,
    PictureUserActivityEntity,
    NotificationEntity,
    NotificationSubscribersUserEntity,
    TagEntity,
    AccessTokenEntity,
    CollectionEntity,
    CollectionPictureEntity,
    CommentEntity,
    FileEntity,
    CredentialsEntity,
    FollowEntity,
    BadgeEntity,
    PictureBadgeActivityEntity,
    UserBadgeActivityEntity,
    InviteEntity,
    LocationEntity,
    // PictureMarkEntity,
  ],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

// export = ormconfig;
export default ormconfig;
