import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PictureService } from '@server/picture/picture.service';
import { UserEntity } from '@server/user/user.entity';
import { Maybe } from '@typings/index';
import { plainToClass } from 'class-transformer';
import { CollectionEntity } from './collection.entity';
import { AddPictureCollectionDot, CreateCollectionDot } from './dto/collection.dto';
import { CollectionPictureEntity } from './picture/collection-picture.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionEntity: Repository<CollectionEntity>,
    @InjectRepository(CollectionPictureEntity)
    private collectionPictureEntity: Repository<CollectionPictureEntity>,
    private pictureService: PictureService,
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
  public async addPicture(id: string, { pictureId }: AddPictureCollectionDot, user: UserEntity) {
    const [picture, collection] = await Promise.all([
      this.pictureService.getRawOne(pictureId),
      this.collectionEntity.findOne(id),
    ]);
    if (!picture) {
      throw new BadRequestException('no picture');
    }
    if (!collection) {
      throw new BadRequestException('no collection');
    }
    const isCollected = await this.isCollected(id, pictureId);
    if (isCollected) {
      throw new BadRequestException('collected');
    }
    await this.collectionPictureEntity.save(
      this.collectionPictureEntity.create({
        collection,
        picture,
      }),
    );
    return {
      message: 'ok',
    };
  }
  // no
  public async getCollectionPictureList(id: string | number, user: Maybe<UserEntity>) {
    const q = await this.collectionPictureEntity.createQueryBuilder('cp')
      .select('COUNT(DISTINCT `pictureId`)', '___pictureId')
      .groupBy()
      .leftJoinAndSelect('cp.picture', 'picture');
    this.pictureService.getQueryInfo<CollectionPictureEntity>(q, user);
    const data = await q.getMany();
    return data;
  }
  /**
   * 是否已收藏
   *
   * @memberof CollectionService
   */
  public async isCollected(id: string | number, pictureId: string | number) {
    const data = await this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.pictureId=:pictureId', { pictureId })
      .andWhere('cp.collectionId=:id', { id })
      .getOne();
    return !!data;
  }

}
