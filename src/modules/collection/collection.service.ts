import {
  BadRequestException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { PictureService } from '@server/modules/picture/picture.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { classToPlain } from 'class-transformer';
import { validator } from '@server/common/utils/validator';
import { Role } from '@server/modules/user/enum/role.enum';
import { CollectionEntity } from './collection.entity';
import {
  CreateCollectionDot, GetCollectionPictureListDto, GetUserCollectionListDto,
} from './dto/collection.dto';
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

  /**
   * 创建收藏夹
   *
   * @param {CreateCollectionDot} body
   * @param {UserEntity} user
   * @returns
   * @memberof CollectionService
   */
  public async create(body: CreateCollectionDot, user: UserEntity) {
    const data = await this.collectionEntity.save(
      this.collectionEntity.create({
        ...body,
        user,
      }),
    );
    return classToPlain(data, {
      groups: [Role.OWNER],
    });
  }

  /**
   * 添加图片到收藏夹
   *
   * @param {string} id
   * @param {AddPictureCollectionDot} { pictureId }
   * @param {UserEntity} user
   * @memberof CollectionService
   */
  public async addPicture(id: string, pictureId: string, user: UserEntity) {
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
        user,
      }),
    );
  }

  public async removePicture(id: string, pictureId: string, _user: UserEntity) {
    const data = await this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.collectionId=:id', { id })
      .andWhere('cp.pictureId=:pictureId', { pictureId })
      .getOne();
    if (data) {
      await this.collectionPictureEntity.delete(data.id);
    } else {
      throw new BadRequestException('no collect');
    }
  }

  // public removePicture(id: string, { pictureId }: AddPictureCollectionDot, user: UserEntity) {
  //   this.collectionPictureEntity.
  // }

  /**
   * select `pictureCount`
   *
   * @template E
   * @param {SelectQueryBuilder<E>} q
   * @param {Maybe<UserEntity>} user
   * @memberof CollectionService
   */
  public selectInfo<E = CollectionEntity>(
    q: SelectQueryBuilder<E>,
    user: Maybe<UserEntity>,
  ) {
    let sql = '';
    const qO = '(picture.isPrivate = 1 OR picture.isPrivate = 0)';
    if (user) {
      sql = `(collection.userId=${user.id} AND ${qO}) OR `;
    }
    q.loadRelationCountAndMap(
      'collection.pictureCount', 'collection.info', 'info',
      qb => qb
        .leftJoin('info.picture', 'picture')
        .leftJoin('info.collection', 'collection')
        .andWhere(`(${sql}picture.isPrivate = 0)`),
    );
  }

  /**
   * 获取收藏夹详情
   *
   * @param {ID} id
   * @param {Maybe<UserEntity>} user
   * @returns
   * @memberof CollectionService
   */
  public async getCollectionDetail(id: ID, user: Maybe<UserEntity>) {
    const q = this.collectionEntity.createQueryBuilder('collection')
      .where('collection.id=:id', { id })
      .leftJoinAndSelect('collection.user', 'user')
      .leftJoinAndSelect('collection.info', 'info')
      .leftJoinAndSelect('info.picture', 'picture')
      .andWhere('picture.isPrivate=0')
      .orderBy('info.createTime', 'DESC')
      .skip(0)
      .take(3);

    this.selectInfo(q, user);
    this.userService.selectInfo(q);
    const collection = await q.getOne();
    const owner = user && collection && user.id === collection.user.id;
    if (!collection || (collection.isPrivate && !owner)) {
      throw new NotFoundException();
    }
    return classToPlain(collection, {
      groups: owner ? [Role.OWNER] : undefined,
    });
  }

  /**
   * 获取收藏夹图片列表
   *
   * @param {ID} id
   * @param {GetCollectionPictureListDto} query
   * @param {Maybe<UserEntity>} user
   * @returns
   * @memberof CollectionService
   */
  public async getCollectionPictureList(
    id: ID,
    query: GetCollectionPictureListDto,
    user: Maybe<UserEntity>,
  ) {
    const collection = await this.collectionEntity.findOne(id);
    const owner = user && collection && user.id === collection.user.id;
    if (!collection) {
      throw new NotFoundException();
    }
    // 检测是否有权限
    if (collection.isPrivate && !owner) {
      throw new ForbiddenException();
    }
    const countQuery = this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.collectionId=:id', { id })
      .select('COUNT(DISTINCT pictureId)', 'count')
      .leftJoin('cp.picture', 'picture');
    if (!owner) {
      countQuery.andWhere('picture.isPrivate=:isPrivate', { isPrivate: false });
    }
    const dataQuery = this.collectionPictureEntity.createQueryBuilder('cp')
      .where('cp.collectionId=:id', { id })
      .select('DISTINCT pictureId')
      .leftJoin('cp.picture', 'picture')
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);
    if (!owner) {
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
    return listRequest(query, classToPlain(pictureList), count.count as number);
  }

  public async getUserCollectionList(idOrName: string, query: GetUserCollectionListDto, user: Maybe<UserEntity>) {
    let isMe = false;
    const q = this.collectionEntity.createQueryBuilder('collection');
    let userValue;
    if (validator.isNumberString(idOrName)) {
      if (user && user.id === idOrName) isMe = true;
      userValue = 'userId';
    } else {
      if (user && user.username === idOrName) isMe = true;
      userValue = 'userUsername';
    }
    q.andWhere(`collection.${userValue}=:id`, { id: idOrName });
    if (!isMe) {
      q.andWhere('collection.isPrivate=:private', { private: false });
    }
    q
      .leftJoinAndSelect('collection.user', 'user')
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize);

    this.userService.selectInfo(q);
    this.selectInfo(q, user);
    const [data, count] = await q.cache(500).getManyAndCount();
    if (data.length === 0) {
      return listRequest(query, [], count);
    }
    let sql = '';
    const qO = '(picture.isPrivate = 1 OR picture.isPrivate = 0)';
    if (user) {
      sql = `(collection.userId=${user.id} AND ${qO}) OR `;
    }
    const previewList = await Promise.all(
      data.map(async v => this.collectionPictureEntity
        .createQueryBuilder('cp')
        .andWhere('cp.collectionId=:id', { id: v.id })
        .leftJoinAndSelect('cp.picture', 'picture')
        .leftJoinAndSelect('cp.collection', 'collection')
        .andWhere(`${sql}picture.isPrivate=0`)
        .orderBy('cp.createTime', 'DESC')
        .skip(0)
        .take(3)
        .getMany()),
    );
    const newData = data.map((collection, index) => {
      const preivewInfos = previewList[index];
      if (preivewInfos) {
        collection.info = preivewInfos;
      } else {
        collection.info = [];
      }
      return collection;
    });
    return listRequest(query, classToPlain(newData), count);
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
