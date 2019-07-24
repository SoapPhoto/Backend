import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { BadRequestError } from '@server/common/enum/message';
import { validator } from '@server/common/utils/validator';
import { OauthServerService } from '@server/oauth/oauth-server/oauth-server.service';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { PictureService } from '@server/picture/picture.service';
import { EmailService } from '@server/shared/email/email.service';
import { LoggingService } from '@server/shared/logging/logging.service';
import { plainToClass } from 'class-transformer';
import { CreateUserDto, UpdateProfileSettingDto } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: LoggingService,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  public async createUser(data: CreateUserDto & Partial<UserEntity>): Promise<UserEntity> {
    const salt = await crypto.randomBytes(32).toString('hex');
    const hash = await crypto.pbkdf2Sync(data.password, salt, 20, 32, 'sha512').toString('hex');
    const user = await this.userEntity.save(
      this.userEntity.create({
        salt,
        hash,
        ...data,
        username: data.username,
        email: data.email,
      }),
    );
    return user;
  }

  public async signup(data: CreateUserDto, isEmail: boolean = true) {
    const user = await this.userEntity.findOne({ email: data.email });
    if (user) {
      throw new BadRequestException(BadRequestError.EmailExist);
    }
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
        throw new BadRequestException('email failed to send');
      }
    }
    return {
      message: 'email is send',
    };
  }

  /**
   * 查询出用户的一些必要数据： `pictureCount`, `likes`
   *
   * @param {SelectQueryBuilder<UserEntity>} q
   * @returns
   * @memberof UserService
   */
  public selectInfo<E>(q: SelectQueryBuilder<E>) {
    return q.loadRelationCountAndMap(
      'user.pictureCount', 'user.pictures',
    )
    .loadRelationCountAndMap(
      'user.likes', 'user.pictureActivitys', 'activity',
      qb => qb.andWhere(
        'activity.like=TRUE',
      ),
    );
  }

  public async verifyUser(username: string, password: string): Promise<UserEntity | undefined> {
    const user = await this.getUser(username, true, ['admin']);
    if (user) {
      const hash = await crypto.pbkdf2Sync(password, user.salt, 20, 32, 'sha512').toString('hex');
      if (hash !== user.hash) {
        return undefined;
      }
      if (!user.verified) {
        throw new UnauthorizedException('email is not activated');
      }
      return plainToClass(UserEntity, user);
    }
    return undefined;
  }

  public async getUser(query: string, user: Maybe<UserEntity> | boolean, groups?: string[]): Promise<UserEntity> {
    const q = this.userEntity.createQueryBuilder('user');
    this.selectInfo<UserEntity>(q);
    const isId = validator.isNumberString(query);
    if (isId) {
      q.where('user.id=:id', { id: query });
    } else {
      q.where('user.username=:username', { username: query });
    }
    const data = await q.cache(100).getOne();
    return plainToClass(UserEntity, data, {
      groups,
    });
  }

  public async getUserPicture(idOrName: string , query: GetPictureListDto, user: Maybe<UserEntity>) {
    return this.pictureService.getUserPicture(idOrName, query, user);
  }

  public async getUserLikePicture(idOrName: string , query: GetPictureListDto, user: Maybe<UserEntity>) {
    return this.pictureService.getUserLikePicture(idOrName, query, user);
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

  public async updateUserProfile(user: UserEntity, body: UpdateProfileSettingDto, avatar?: string, groups?: string[]) {
    const data = await this.userEntity.save(
      this.userEntity.merge(
        user,
        body,
        avatar ? { avatar } : {},
      ),
    );
    return plainToClass(UserEntity, data, {
      groups,
    });
  }
}
