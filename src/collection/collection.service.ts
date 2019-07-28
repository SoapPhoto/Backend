import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { PictureEntity } from '@server/picture/picture.entity';
import { PictureService } from '@server/picture/picture.service';
import { UserEntity } from '@server/user/user.entity';
import { UserService } from '@server/user/user.service';
import { plainToClass } from 'class-transformer';
import { CollectionEntity } from './collection.entity';
import { AddPictureCollectionDot, CreateCollectionDot, GetCollectionPictureListDto } from './dto/collection.dto';
import { CollectionPictureEntity } from './picture/collection-picture.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(CollectionEntity)
    private collectionEntity: Repository<CollectionEntity>,
    @InjectRepository(CollectionPictureEntity)
    private collectionPictureEntity: Repository<CollectionPictureEntity>,
    private pictureService: PictureService,
    private userService: UserService,
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

  public async getCollectionDetail(id: ID, user: Maybe<UserEntity>) {
    const q = this.collectionEntity.createQueryBuilder('collection')
      .where('collection.id=:id', { id })
      .leftJoinAndSelect('collection.user', 'user');
      // .innerJoin('collection.info', 'info')
      // .innerJoin('info.picture', 'picture');

    this.userService.selectInfo(q);
    const collection = await q.getOne();
    const isMe = user && user.id === user.id;
    if (!collection || collection.isPrivate && !isMe) {
      throw new NotFoundException();
    }
    return plainToClass(CollectionEntity, collection, {
      groups: isMe ? ['me'] : undefined,
    });
  }

  public async getCollectionPictureList(
    id: ID,
    query: GetCollectionPictureListDto,
    user: Maybe<UserEntity>,
  ) {
    const collection = await this.collectionEntity.findOne(id);
    const isMe = user && user.id === user.id;
    if (!collection) {
      throw new NotFoundException();
    }
    // 检测是否有权限
    if (collection.isPrivate && !isMe) {
      throw new ForbiddenException();
    }
    const countQuery = this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.collectionId=:id', { id })
      .select('COUNT(DISTINCT pictureId)', 'count')
      .leftJoin('cp.picture', 'picture');
    if (!isMe) {
      countQuery.andWhere('picture.isPrivate=:isPrivate', { isPrivate: false });
    }
    const dataQuery = this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.collectionId=:id', { id })
      .select('DISTINCT pictureId')
      .addSelect('pictureId')
      .leftJoin('cp.picture', 'picture')
      .skip((query.page - 1) * query.pageSize).take(query.pageSize);
    if (!isMe) {
      dataQuery.andWhere('picture.isPrivate=:isPrivate', { isPrivate: false });
    }
    const [count, list] = await Promise.all([
      countQuery.getRawOne(),
      dataQuery.getRawMany(),
    ]);
    if (list.length === 0) {
      return listRequest(query, [], count.count as number);
    }
    const q = this.pictureService.selectList(user);
    q.andWhere('picture.id IN (:...ids)', { ids: list.map(d => d.pictureId) });
    const pictureList = await q.getMany();
    return listRequest(query, plainToClass(PictureEntity, pictureList), count.count as number);
  }
  /**
   * 是否已收藏
   *
   * @memberof CollectionService
   */
  public async isCollected(id: ID, pictureId: ID) {
    const data = await this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.pictureId=:pictureId', { pictureId })
      .andWhere('cp.collectionId=:id', { id })
      .getOne();
    return !!data;
  }

}
