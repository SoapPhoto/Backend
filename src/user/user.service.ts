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
    const user = await this.userEntity.findOne({ username });
    if (user) {
      const hash = await crypto.pbkdf2Sync(password, user.salt, 20, 32, 'sha512').toString('hex');
      if (hash === user.hash) {
        return plainToClass(UserEntity, user);
      }
    }
    return undefined;
  }
}
