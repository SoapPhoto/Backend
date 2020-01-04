import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
import { Repository, SelectQueryBuilder } from 'typeorm';
import uid from 'uniqid';
import { omit, isArray } from 'lodash';
import { fieldsProjection } from 'graphql-fields-list';

import { validator } from '@common/validator';
import { PictureService } from '@server/modules/picture/picture.service';
import { EmailService } from '@server/shared/email/email.service';
import { LoggingService } from '@server/shared/logging/logging.service';
import { plainToClass, classToPlain } from 'class-transformer';
import { ValidationException } from '@server/common/exception/validation.exception';
import { GraphQLResolveInfo } from 'graphql';
import { CreateUserDto, UpdateProfileSettingDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { Role } from './enum/role.enum';
import { FileService } from '../file/file.service';
import { BadgeEntity } from '../badge/badge.entity';
import { BadgeService } from '../badge/badge.service';
import { GetPictureListDto } from '../picture/dto/picture.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggingService,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => BadgeService))
    private readonly badgeService: BadgeService,
  ) {}

  public async createUser(data: CreateUserDto & Partial<UserEntity>): Promise<UserEntity> {
    const { salt, hash } = await this.getPassword(data.password);
    const newUser = this.userEntity.create({
      salt,
      hash,
      ...data,
      username: data.username.toLowerCase(),
      email: data.email,
    });
    await this.userEntity.createQueryBuilder('user')
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values(newUser)
      .execute();
    return newUser;
  }

  public async createOauthUser(data: Partial<UserEntity>) {
    const is = await this.isSignup(data.username!, data.email!, false);
    let username = data.username!;
    if (is && is === 'username') {
      username = uid(`${username}-`);
    }
    return this.userEntity.save(this.userEntity.create({
      ...data,
      username: username.toLowerCase(),
    }));
  }

  public async getPassword(password: string) {
    const salt = await crypto.randomBytes(32).toString('hex');
    const hash = await crypto.pbkdf2Sync(password, salt, 20, 32, 'sha512').toString('hex');
    return {
      salt,
      hash,
    };
  }

  public async isSignup(username: string, email: string, err = true) {
    const [nameData, userData] = await Promise.all([
      this.userEntity.findOne({ username }),
      this.userEntity.findOne({ email }),
    ]);
    if (nameData) {
      if (err) {
        throw new ValidationException('username', 'username_exists');
      }
      return 'username';
    }
    if (userData) {
      if (err) {
        throw new ValidationException('email', 'email_exists');
      }
      return 'email';
    }
    return false;
  }

  public async signup(data: CreateUserDto, isEmail = true) {
    const info: MutablePartial<UserEntity> = {};
    if (isEmail) {
      info.identifier = data.email;
      info.verificationToken = Math.random().toString(35).substr(2, 6);
    }
    const userInfo = await this.createUser({
      ...data,
      ...info,
    });
    // 发送email验证邮件
    if (isEmail) {
      try {
        await this.emailService.sendSignupEmail(info.identifier!, info.verificationToken!, userInfo);
      } catch (err) {
        this.logger.error(err);
        throw new BadRequestException('activation_email_failed');
      }
    }
    return {
      message: 'Email is send',
    };
  }

  public async verifyUser(username: string, password: string): Promise<UserEntity | undefined> {
    const q = this.userEntity.createQueryBuilder('user')
      .where('user.username=:username', { username });
    this.selectBadge(q);
    const user = await q.getOne();
    if (user) {
      const hash = crypto.pbkdf2Sync(password, user.salt, 20, 32, 'sha512').toString('hex');
      if (hash !== user.hash) {
        return undefined;
      }
      // if (!user.isVerified()) {
      //   throw new UnauthorizedException('Email is not activated');
      // }
      return user;
    }
    return undefined;
  }

  public async findOne(query: ID, _user: Maybe<UserEntity>, info?: GraphQLResolveInfo | string[]) {
    const q = this.userEntity.createQueryBuilder('user');
    const isId = validator.isNumber(query) || validator.isNumberString(query as string);
    if (isId) {
      q.where('user.id=:id', { id: query });
    } else {
      q.where('user.username=:username', { username: query });
    }
    if (isArray(info)) {
      this.selectInfo(q, {
        select: info,
        value: 'user',
      });
    } else {
      this.selectInfo(q, {
        info,
        value: 'user',
      });
    }
    const data = await q.getOne();
    return data;
  }

  public selectInfo<E>(q: SelectQueryBuilder<E>, options?: ISelectOptions) {
    if (options?.info) {
      const select = fieldsProjection(options.info);
      if (select['badge.id']) {
        this.selectBadge(q, options.value);
      }
    }
    if (options?.select && options?.select?.includes('badge')) {
      this.selectBadge(q, options.value);
    }
    return q;
  }

  /**
   * 查询用户徽章
   *
   * @template E
   * @param {SelectQueryBuilder<E>} q
   * @param {string} [value='user']
   * @returns
   * @memberof UserService
   */
  public selectBadge<E>(q: SelectQueryBuilder<E>, value = 'user') {
    return q
      .leftJoin(this.badgeService.userActivityMetadata.tableName, 'userBadgeActivity', `userBadgeActivity.userId=${value}.id`)
      .leftJoinAndMapMany(`${value}.badge`, BadgeEntity, 'userBadge', 'userBadgeActivity.badgeId=userBadge.id');
  }

  public async getRawIdsList(ids: string[], user: Maybe<UserEntity>) {
    const q = this.userEntity.createQueryBuilder('user')
      .where('user.id IN (:...ids)', { ids });
    this.selectBadge(q);
    return q.getMany();
  }

  public async updateUser(user: UserEntity, body: Partial<UserEntity>, groups?: string[]) {
    const data = await this.userEntity.save(
      this.userEntity.merge(
        user,
        body,
      ),
    );
    return plainToClass(UserEntity, data, {
      groups,
    });
  }

  public async updateUserProfile(user: UserEntity, body: UpdateProfileSettingDto) {
    const [, data] = await Promise.all([
      this.fileService.activated(body.key),
      this.userEntity.save(
        this.userEntity.merge(
          user,
          omit(body, ['key']),
          body.key ? { avatar: body.key } : {},
        ),
      ),
    ]);
    return classToPlain(data, {
      groups: [Role.OWNER],
    });
  }

  public isId(id: string | number) {
    return validator.isNumber(id) || validator.isNumberString(id as string);
  }
}
