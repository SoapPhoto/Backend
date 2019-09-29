import { classToPlain, classToClass } from 'class-transformer';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { validator } from '@server/common/utils/validator';
import { GetTagPictureListDto } from '@server/modules/tag/dto/tag.dto';
import { TagService } from '@server/modules/tag/tag.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { CollectionPictureEntity } from '@server/modules/collection/picture/collection-picture.entity';
import { GetPictureListDto, UpdatePictureDot } from './dto/picture.dto';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityService } from './user-activity/user-activity.service';
import { Role } from '../user/enum/role.enum';
import { CollectionService } from '../collection/collection.service';

@Injectable()
export class PictureService {
  constructor(
    private readonly activityService: PictureUserActivityService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
    @InjectRepository(PictureEntity)
    private pictureRepository: Repository<PictureEntity>,
  ) {}

  public create = async (data: Partial<PictureEntity>) => {
    const newData = { ...data };
    if (Array.isArray(data.tags)) {
      newData.tags = await Promise.all(data.tags.map(tag => this.tagService.createTag(tag)));
    }
    const createData = await this.pictureRepository.save(
      this.pictureRepository.create(data),
    );
    return classToClass(createData, { groups: [Role.OWNER] });
  }

  public update = async (id: ID, { tags, ...data }: UpdatePictureDot, user: UserEntity) => {
    const picture = await this.pictureRepository.createQueryBuilder('picture')
      .where('picture.id=:id', { id })
      .leftJoinAndSelect('picture.user', 'user')
      .getOne();
    if (!picture || picture.user.id !== user.id) {
      throw new ForbiddenException();
    }
    const updateData: Partial<PictureEntity> = data;
    if (tags.length > 0) {
      const newTags = await Promise.all(
        (tags as string[]).map((tag: string) => this.tagService.createTag({ name: tag })),
      );
      updateData.tags = newTags;
    } else {
      updateData.tags = [];
    }
    return classToClass(await this.pictureRepository.save(
      this.pictureRepository.merge(
        picture,
        updateData,
      ),
    ), {
      groups: [Role.OWNER],
    });
  }

  /**
   * 图片列表查询
   *
   * @memberof PictureService
   */
  public getList = async (user: Maybe<UserEntity>, query: GetPictureListDto) => {
    const [data, count] = await this.selectList(user, query)
      .andWhere('picture.isPrivate=:private', { private: false })
      .getManyAndCount();
    return listRequest(query, data, count);
  }

  /**
   * 增加阅读数量
   *
   * @param {number} id
   * @returns
   * @memberof PictureService
   */
  public addViewCount(id: number) {
    return this.pictureRepository.createQueryBuilder()
      .update()
      .set({
        views: () => 'views + 1',
      })
      .where('id = :id', { id })
      .execute();
  }

  /**
   * 获取单个图片的信息
   *
   * @memberof PictureService
   */
  public async getOnePicture (
    id: string,
    user: Maybe<UserEntity>,
  ): Promise<PictureEntity>

  // eslint-disable-next-line no-dupe-class-members
  public async getOnePicture (
    id: string,
    user: Maybe<UserEntity>,
    view: boolean,
  ): Promise<PictureEntity>

  /**
   * 获取单个图片的信息 返回格式化过的object
   *
   * @memberof PictureService
   */
  // eslint-disable-next-line no-dupe-class-members
  public async getOnePicture (
    id: string,
    user: Maybe<UserEntity>,
    view: boolean,
    isClass: boolean,
  ): Promise<Record<string, any>>

  // eslint-disable-next-line no-dupe-class-members
  public async getOnePicture(
    id: string,
    user: Maybe<UserEntity>,
    view?: boolean,
    isClass?: boolean,
  ): Promise<PictureEntity | Record<string, any>> {
    const q = this.select(user)
      .andWhere('picture.id=:id', { id })
      .leftJoinAndSelect('picture.tags', 'tag');
    const data = await q.cache(100).getOne();
    if (view && data) {
      this.addViewCount(data.id);
      data.views += 1;
    }
    const isOwner = data && data.user.id === (user ? user.id : null);
    if (!data || (data && data.isPrivate && !isOwner)) {
      throw new NotFoundException();
    }
    // data.relateCollection = await this.collectionService.pictureRelatedCollection(data.id) as any;
    if (!isClass) {
      return classToClass(data, {
        groups: isOwner ? [Role.OWNER] : [],
      });
    }
    return classToPlain(data, {
      groups: isOwner ? [Role.OWNER] : [],
    });
  }

  /**
   * 喜欢图片
   *
   * @memberof PictureService
   */
  public likePicture = async (id: string, user: UserEntity, data: boolean) => {
    const picture = await this.getOne(id);
    if (!picture) {
      throw new BadRequestException('no_picture');
    }
    return this.activityService.like(picture, user, data);
  }

  /**
   * 获取某个用户的图片列表
   *
   * @memberof PictureService
   */
  public getUserPicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const q = this.selectList(user, query);
    let isOwner = false;
    if (validator.isNumberString(idOrName)) {
      if (user && user.id === idOrName) isOwner = true;
      q.andWhere('picture.userId=:id', { id: idOrName });
    } else {
      if (user && user.username === idOrName) isOwner = true;
      q.andWhere('picture.userUsername=:id', { id: idOrName });
    }
    if (!isOwner) {
      q.andWhere('picture.isPrivate=:private', { private: false });
    }
    const [data, count] = await q.cache(100).getManyAndCount();
    return listRequest(query, classToClass(data, {
      groups: isOwner ? [Role.OWNER] : undefined,
    }), count);
  }

  /**
   * 某个用户喜欢的图片列表
   *
   * @memberof PictureService
   */
  public getUserLikePicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const [count, ids] = await this.activityService.getLikeList(idOrName, query, user);
    if (ids.length === 0) {
      return listRequest(query, [], count as number);
    }
    const q = this.selectList(user);
    q.andWhere('picture.id IN (:...ids)', { ids });
    const data = await q.getMany();
    return listRequest(query, data, count as number);
  }

  /**
   * 获取某个标签的图片列表
   *
   * @memberof PictureService
   */
  public getTagPictureList = async (name: string, user: Maybe<UserEntity>, query: GetTagPictureListDto) => {
    const q = this.selectList(user);
    const [data, count] = await q
      .innerJoinAndSelect('picture.tags', 'tags', 'tags.name=:name', { name })
      .getManyAndCount();
    return listRequest(query, data, count);
  }

  /**
   * 删除图片
   *
   * @memberof PictureService
   */
  public delete = async (id: ID, user: UserEntity) => {
    const data = await this.getOne(id);
    if (!data) {
      throw new BadRequestException();
    }
    if (data.user.id === user.id) {
      this.pictureRepository.createQueryBuilder()
        .delete()
        .from(PictureEntity)
        .where('id=:id', { id })
        .execute();
      return {
        done: true,
      };
    }
    throw new ForbiddenException();
  }

  /**
   * 图片的初始查询条件
   *
   * @memberof PictureService
   */
  public select = (user: Maybe<UserEntity>) => {
    const q = this.pictureRepository.createQueryBuilder('picture')
      .loadRelationCountAndMap(
        'picture.likes', 'picture.activitys', 'activity',
        qb => qb.andWhere('activity.like=:like', { like: true }),
      );
    this.selectInfo(q, user);
    q.orderBy('picture.createTime', 'DESC');
    return q;
  }

  /**
   * 图片列表的初始查询条件
   *
   * @memberof PictureService
   */
  public selectList = (user: Maybe<UserEntity>, query?: GetPictureListDto) => {
    const q = this.select(user);
    if (query) {
      if (query.timestamp) {
        q.where('picture.createTime <= :time', { time: query.time });
      }
      q.skip((query.page - 1) * query.pageSize).take(query.pageSize);
    }
    return q;
  }

  /**
   * 没有任何关联的查询图片信息
   *
   * @memberof PictureService
   */
  public getRawOne = async (id: ID) => this.pictureRepository.createQueryBuilder('picture')
    .where('picture.id=:id', { id })
    .getOne()

  /**
   * 获取图片的一些基础信息的查询，如：`likes`,`isLike`
   *
   * @memberof PictureService
   */
  // eslint-disable-next-line arrow-parens
  public selectInfo = <T>(q: SelectQueryBuilder<T>, user: Maybe<UserEntity>, value = 'user') => {
    q.leftJoinAndSelect('picture.user', value)
      .loadRelationCountAndMap(
        'picture.likes', 'picture.activitys', 'activity',
        qb => qb.andWhere('activity.like=:like', { like: true }),
      );
    this.userService.selectInfo(q, value);
    if (user) {
      q
        .loadRelationCountAndMap(
          'picture.isLike', 'picture.activitys', 'activity',
          qb => qb.andWhere(
            'activity.userId=:userId AND activity.like=:like',
            { userId: user.id, like: true },
          ),
        )
        .leftJoinAndMapMany(
          'picture.info',
          CollectionPictureEntity,
          'picture_collection_info', 'picture_collection_info.pictureId = picture.id',
        )
        .leftJoinAndSelect('picture_collection_info.collection', 'picture_collection');
    }
  }

  /**
   * 获取图片基本信息，大多用于操作的时候查询做判断
   *
   * @private
   * @memberof PictureService
   */
  private getOne = async (id: ID) => this.pictureRepository.createQueryBuilder('picture')
    .where('picture.id=:id', { id })
    .leftJoinAndSelect('picture.user', 'user')
    .getOne()
}
