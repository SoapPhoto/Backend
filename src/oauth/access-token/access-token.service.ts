import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '@server/user/user.service';
import { AccessTokenEntity } from './access-token.entity';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private accessTokenRepository: Repository<AccessTokenEntity>,
    private readonly userService: UserService,
  ) {}

  public create = async (data: Partial<AccessTokenEntity>) => {
    return this.accessTokenRepository.save(
      this.accessTokenRepository.create(data),
    );
  }
  public getRefreshToken = async (refreshToken: string) => {
    const token = await this.accessTokenRepository.findOne({
      relations: ['client', 'user'],
      where: {
        refreshToken,
      },
    });
    return token;
  }
  public getAccessToken = async (accessToken: string) => {
    const token = await this.accessTokenRepository.createQueryBuilder('token')
      .where('token.accessToken=:accessToken', { accessToken })
      .leftJoinAndSelect('token.user', 'user')
      .leftJoinAndSelect('token.client', 'client')
      .getOne();
    return token;
  }
}
