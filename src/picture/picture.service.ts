import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientEntity } from '@/oauth/client/client.entity';
import { PictureEntity } from './picture.entity';

@Injectable()
export class PictureService {
  constructor(
    @InjectRepository(PictureEntity)
    private pictureRepository: Repository<PictureEntity>,
  ) {}
  public create = async (data: Partial<PictureEntity>) => {
    return this.pictureRepository.save(
      this.pictureRepository.create(data),
    );
  }
  public getList = async () => {
    return this.pictureRepository.createQueryBuilder('picture')
      .leftJoinAndSelect('picture.user', 'user')
      .skip(0)
      .take(10)
      .getMany();
  }
}
