import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { EmailService } from '@server/common/modules/email/email.service';
import { validator } from '@server/common/utils/validator';
import { GetPictureListDto } from '@server/picture/dto/picture.dto';
import { PictureService } from '@server/picture/picture.service';
import { Maybe } from '@typings/index';
import { plainToClass } from 'class-transformer';
import { CreateUserDto, UpdateProfileSettingDto } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private pictureService: PictureService,
    private EmailService: EmailService,
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
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
      throw new BadGatewayException('email is registered');
    }
    const identifier = data.email;
    const verificationToken = Math.random().toString(35).substr(2, 6);
    // this.createUser({
    //   ...data,
    //   identifier,
    //   verificationToken,
    // });
    this.EmailService.sendSignupEmail(identifier, verificationToken);
  }

  public async verifyUser(username: string, password: string): Promise<UserEntity | undefined> {
    const user = await this.userEntity.createQueryBuilder('user')
      .where('user.username=:username', { username })
      .getOne();
    if (user) {
      const hash = await crypto.pbkdf2Sync(password, user.salt, 20, 32, 'sha512').toString('hex');
      if (hash === user.hash) {
        return plainToClass(UserEntity, user);
      }
    }
    return undefined;
  }

  public async getUser(query: string, user: Maybe<UserEntity>): Promise<UserEntity> {
    const q = this.userEntity.createQueryBuilder('user')
      .loadRelationCountAndMap(
        'user.pictureCount', 'user.pictures',
      );
    const isId = validator.isNumberString(query);
    if (isId) {
      q.where('user.id=:id', { id: query });
    } else {
      q.where('user.username=:username', { username: query });
    }
    if (user) {
      q
        .loadRelationCountAndMap(
          'user.likes', 'user.pictureActivitys', 'activity',
          qb => qb.andWhere(
            `activity.${isId ? 'userId' : 'userUserName'}=:query AND activity.like=:like`,
            { query, like: true },
          ),
        );
    }
    const data = await q.cache(true).getOne();
    return plainToClass(UserEntity, data);
  }

  public async getUserPicture(id: string , query: GetPictureListDto, user: Maybe<UserEntity>) {
    return this.pictureService.getUserPicture(id, query, user);
  }

  public async updateUserProfile(user: UserEntity, body: UpdateProfileSettingDto, avatar?: string) {
    const data = await this.userEntity.save(
      this.userEntity.merge(
        user,
        body,
        avatar ? { avatar } : {},
      ),
    );
    console.log(data);
    return plainToClass(UserEntity, data);
  }
}
