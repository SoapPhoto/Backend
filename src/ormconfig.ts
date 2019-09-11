/* eslint-disable import/first */
/// <reference types="../typings/index" />
/// <reference types="../typings/typing" />

require('dotenv').config();

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

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  port: Number(process.env.DATABASE_PORT),
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV !== 'production', // TODO: Remove in production!
  // migrationsRun: true,
  logging: true,
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
  ],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default config;
