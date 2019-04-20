import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccessTokenEntity } from './access-token.entity';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private accessTokenRepository: Repository<AccessTokenEntity>,
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
}
