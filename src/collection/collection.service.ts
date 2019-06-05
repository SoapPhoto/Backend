import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@server/user/user.entity';
import { plainToClass } from 'class-transformer';
import { CollectionEntity } from './collection.entity';
import { CreateCollectionDot } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionEntity: Repository<CollectionEntity>,
  ) {}
  public async create(body: CreateCollectionDot, user: UserEntity) {
    const data = await this.collectionEntity.save(
      this.collectionEntity.create({
        ...body,
        user,
      }),
    );
    return plainToClass(CollectionEntity, data, {
      groups: ['me'],
    });
  }
}
