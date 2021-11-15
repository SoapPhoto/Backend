/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { inviteCode } from '@server/common/utils/id';
import { Repository } from 'typeorm';
import { InviteEntity } from './invite.entity';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(InviteEntity)
    private inviteRepository: Repository<InviteEntity>,
  ) {}

  public async create() {
    const code = inviteCode();
    return this.inviteRepository.save(
      this.inviteRepository.create({
        code,
      }),
    );
  }
}
