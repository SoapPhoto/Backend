import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { CredentialsEntity } from './credentials.entity';

@Injectable()
export class CredentialsService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(CredentialsEntity)
    private credentialsRepository: Repository<CredentialsEntity>,
  ) {}

  public getInfo = async (id: ID) => this.credentialsRepository.createQueryBuilder('cr')
    .where('cr.id=:id', { id })
    .leftJoinAndSelect('cr.user', 'user')
    .getOne()

  public async create(data: Partial<CredentialsEntity>) {
    return this.credentialsRepository.save(
      this.credentialsRepository.create(data),
    );
  }
}
