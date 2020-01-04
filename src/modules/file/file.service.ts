import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FileEntity } from './file.entity';
import { CreateFileDot } from './dto/file.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async create(data: CreateFileDot) {
    const user = await this.userService.findOne(data.userId, null);
    await this.fileRepository
      .createQueryBuilder()
      .insert()
      .into(FileEntity)
      .values({ ...data, user })
      .execute();
  }

  public async getOne(key: string) {
    return this.fileRepository.createQueryBuilder('file')
      .where('file.key=:key', { key })
      .getOne();
  }

  public async activated(key: string) {
    return this.fileRepository
      .createQueryBuilder()
      .update(FileEntity)
      .set({ active: true })
      .where('key=:key', { key })
      .execute();
  }
}
