import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntity: Repository<UserEntity>,
  ) {}

  public async createUser(data: CreateUserDto) {
    const salt = await crypto.randomBytes(32).toString('hex');
    const hash = await crypto.pbkdf2Sync(data.password, salt, 20, 32, 'sha512').toString('hex');
    const user = await this.userEntity.save(
      this.userEntity.create({
        salt,
        hash,
        username: data.username,
        email: data.email,
      }),
    );
    return user;
  }
  public async verifyUser(username: string, password: string) {
    const user = await this.userEntity.createQueryBuilder('user')
      .where('user.username=:username', { username })
      .addSelect('user.hash')
      .addSelect('user.salt')
      .getOne();
    if (user) {
      const hash = await crypto.pbkdf2Sync(password, user.salt, 20, 32, 'sha512').toString('hex');
      if (hash === user.hash) {
        return plainToClass(UserEntity, user);
      }
    }
    return undefined;
  }

  public async getUserById(query: string, user?: UserEntity) {
    return this.getUser('id', query, user);
  }

  public async getUserByName(query: string, user?: UserEntity) {
    return this.getUser('username', query, user);
  }

  public async getUser(type: 'id' | 'username', query: string, user?: UserEntity) {
    const q = this.userEntity.createQueryBuilder('user');
    console.log(type, query);
    if (type === 'id') {
      q.where('user.id=:id', { id: query });
    } else {
      q.where('user.username=:username', { username: query });
    }
    if (user) {
      q
        .loadRelationCountAndMap(
          'user.likes', 'user.pictureActivitys', 'activity',
          qb => qb.andWhere(
            `activity.${type === 'id' ? 'userId' : 'userUserName'}=:query AND activity.like=:like`,
            { query, like: true },
          ),
        );
    }
    const data = await q.cache(true).getOne();
    return plainToClass(UserEntity, data);
  }
}
