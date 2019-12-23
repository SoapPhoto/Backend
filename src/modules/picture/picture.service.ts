import {
  classToPlain,
} from 'class-transformer';
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
import dayjs from 'dayjs';
import { RedisService } from 'nestjs-redis';

import { listRequest } from '@server/common/utils/request';
import { validator } from '@common/validator';
import { GetTagPictureListDto } from '@server/modules/tag/dto/tag.dto';
import { TagService } from '@server/modules/tag/tag.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { GetPictureListDto, UpdatePictureDot, GetNewPictureListDto } from './dto/picture.dto';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityService } from './user-activity/user-activity.service';
import { Role } from '../user/enum/role.enum';
import { CollectionService } from '../collection/collection.service';
import { CommentService } from '../comment/comment.service';
import { BadgeService } from '../badge/badge.service';

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
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => BadgeService))
    private readonly badgeService: BadgeService,
    @InjectRepository(PictureEntity)
    private pictureRepository: Repository<PictureEntity>,
    private readonly redisService: RedisService,
  ) {}

  public async create(data: Partial<PictureEntity>) {
    const newData = { ...data };
    if (Array.isArray(data.tags)) {
      newData.tags = await Promise.all(data.tags.map(tag => this.tagService.createTag(tag)));
    }
    return classToPlain(await this.pictureRepository.save(
      this.pictureRepository.create(newData),
    ), { groups: [Role.OWNER] });
  }

  public async update(id: number, { tags, ...data }: UpdatePictureDot, user: UserEntity) {
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
    return classToPlain(
      await this.pictureRepository.save(
        this.pictureRepository.merge(
          picture,
          updateData,
        ),
      ),
      { groups: [Role.OWNER] },
    );
  }

  /**
   * 图片列表查询
   *
   * @memberof PictureService
   */
  public getList = async (user: Maybe<UserEntity>, query: GetPictureListDto) => {
    const [data, count] = await Promise.all([
      this.selectList(user, query)
        .andWhere('picture.isPrivate=:private', { private: false })
        .getMany(),
      this.pictureRepository.createQueryBuilder('picture')
        .andWhere('picture.isPrivate=:private', { private: false })
        .getCount(),
    ]);
    return listRequest(query, data, count);
  }

  public getNewList = async (user: Maybe<UserEntity>, query: GetNewPictureListDto) => {
    const q = this.selectList(user, { ...query, timestamp: undefined } as GetNewPictureListDto)
      .andWhere('picture.isPrivate=:private', { private: false })
      .andWhere('picture.createTime > :after', { after: query.lastTime })
      .andWhere('picture.createTime <= :before', { before: query.time });
    const [data, count] = await Promise.all([
      q.getMany(),
      q.getCount(),
    ]);
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
  public async getOnePicture(
    id: number,
    user: Maybe<UserEntity>,
    view?: boolean,
  ) {
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
    return classToPlain(data, {
      groups: isOwner ? [Role.OWNER] : [],
    });
  }

  public async getPicture(
    id: string,
    user: Maybe<UserEntity>,
    view?: boolean,
  ) {
    const q = this.pictureRepository.createQueryBuilder('picture')
      .andWhere('picture.id=:id', { id })
      .leftJoinAndSelect('picture.tags', 'tag')
      .leftJoinAndSelect('picture.user', 'user')
      .orderBy('picture.createTime', 'DESC');
    const data = await q.cache(100).getOne();
    const isOwner = data && data.user.id === (user ? user.id : null);
    if (view && data) {
      this.addViewCount(data.id);
      data.views += 1;
    }
    if (!data || (data && data.isPrivate && !isOwner)) {
      throw new NotFoundException();
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
  public likePicture = async (id: number, user: UserEntity, data: boolean) => {
    const picture = await this.getOne(id);
    if (!picture) {
      throw new BadRequestException('no_exist_picture');
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
      if (user && user.id.toString() === idOrName) isOwner = true;
      q.andWhere('picture.userId=:id', { id: idOrName });
    } else {
      if (user && user.username === idOrName) isOwner = true;
      q.andWhere('picture.userUsername=:id', { id: idOrName });
    }
    if (!isOwner) {
      q.andWhere('picture.isPrivate=:private', { private: false });
    }
    const [data, count] = await q.cache(100).getManyAndCount();
    return listRequest(query, classToPlain(data, {
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
    return listRequest(query, classToPlain(data), count as number);
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
      .andWhere('picture.isPrivate=:private', { private: false })
      .getManyAndCount();
    return listRequest(query, classToPlain(data), count);
  }

  /**
   * 删除图片
   *
   * @memberof PictureService
   */
  public delete = async (id: number, user: UserEntity) => {
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
    const q = this.pictureRepository.createQueryBuilder('picture');
    // .loadRelationCountAndMap(
    //   'picture.likedCount', 'picture.activities', 'activity',
    //   qb => qb.andWhere('activity.like=:like', { like: true }),
    // );
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
   * 获取用户的预览图片
   *
   * @param {string} username
   * @param {number} limit
   * @returns
   * @memberof PictureService
   */
  public async getUserPreviewPictures(username: string, limit: number) {
    return this.pictureRepository.createQueryBuilder('picture')
      .where('picture.userUsername=:username', { username })
      .andWhere('picture.isPrivate=0')
      .orderBy('picture.createTime', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * 获取用户对某个图片收藏的收藏夹
   *
   * @param {number} id
   * @param {UserEntity} user
   * @returns
   * @memberof PictureService
   */
  public async getCurrentCollections(id: number, user: UserEntity) {
    return classToPlain(
      await this.collectionService.getCurrentCollections(id, user),
      { groups: [Role.OWNER] },
    );
  }

  public getPictureHotInfoList = async (user: Maybe<UserEntity>, query: GetPictureListDto) => {
    const client = this.redisService.getClient();
    const limit = (query.page - 1) * query.pageSize;
    const [ids, count] = await Promise.all([
      client.zrevrange('picture_hot', limit, limit + query.pageSize),
      client.zcount('picture_hot', -1000000, 1000000),
    ]);
    const q = this.pictureRepository.createQueryBuilder('picture');
    this.selectInfo(q, user);
    // const data = await Promise.all(ids.map(v => this.getOnePicture(v, user)));
    q.where(`picture.id IN (${ids.toString()})`)
      .orderBy(`FIELD(\`picture\`.\`id\`, ${ids.toString()})`)
      .cache(1000);
    const data = await q.getMany();
    return listRequest(query, classToPlain(data), count as number);
  }

  public async getHotPictures() {
    const data = await this.pictureRepository.createQueryBuilder('picture')
      .where('picture.isPrivate=:isPrivate', { isPrivate: false })
      .select('picture.id, picture.views, picture.createTime')
      .leftJoinAndMapOne(
        'picture.badge',
        this.badgeService.pictureActivityMetadata.tableName,
        'pictureBadge',
        'pictureBadge.pictureId=picture.id AND pictureBadge.badgeId=1',
      )
      .limit(1000)
      .getRawMany();
    const ids = data.map(v => v.id);
    const [likes, comments] = await Promise.all([
      this.activityService.getPicturesLikeCount(ids),
      this.commentService.getPicturesCommentCount(ids),
    ]);
    const zData: any[] = [];
    data.forEach((item) => {
      let count = 0;
      const likeItem = likes.find(v => v.pictureId === item.id);
      const commentItem = comments.find(v => v.pictureId === item.id);
      item.likedCount = Number(likeItem?.count ?? 0);
      item.commentCount = Number(commentItem?.count ?? 0);
      count += item.views;
      count += item.likedCount * 5;
      count += item.commentCount * 10;
      if (item.pictureBadge_badgeId === 1) {
        count += 100;
      }
      item.count = count;
      const crTime = dayjs(item.createTime).valueOf();
      const nowTime = dayjs().valueOf();
      item.count /= ((nowTime - crTime) / 10000000000);
      zData.push(item.count, item.id);
    });
    return zData;
  }

  /**
   * 没有任何关联的查询图片信息
   *
   * @memberof PictureService
   */
  public getRawOne = async (id: number) => this.pictureRepository.createQueryBuilder('picture')
    .where('picture.id=:id', { id })
    .getOne()

  /**
   * 获取图片的一些基础信息的查询，如：`likedCount`,`isLike`
   *
   * @memberof PictureService
   */
  // eslint-disable-next-line arrow-parens
  public selectInfo = <T>(q: SelectQueryBuilder<T>, user: Maybe<UserEntity>, value = 'user') => {
    q.leftJoinAndSelect('picture.user', value)
      .loadRelationCountAndMap(
        'picture.likedCount', 'picture.activities', 'activity',
        qb => qb.andWhere('activity.like=:like', { like: true }),
      );
    // this.userService.selectInfo(q, value);
    if (user) {
      q
        .loadRelationCountAndMap(
          'picture.isLike', 'picture.activities', 'activity',
          qb => qb.andWhere(
            'activity.userId=:userId AND activity.like=:like',
            { userId: user.id, like: true },
          ),
        );
      // .leftJoinAndMapMany(
      //   'picture.info',
      //   CollectionPictureEntity,
      //   'picture_collection_info',
      //   'picture_collection_info.pictureId = picture.id AND picture_collection_info.userId=:userId', {
      //     userId: user.id,
      //   },
      // )
      // .leftJoinAndSelect('picture_collection_info.collection', 'picture_collection');
    }
  }

  public getPictureLikes = (id: number) => this.activityService.getLikes(id)

  public getUserIsLike = (id: number, user: UserEntity) => this.activityService.isLike(id, user)

  public userLikesCount = (id: number) => this.activityService.userLikesCount(id)

  /**
   * 获取图片基本信息，大多用于操作的时候查询做判断
   *
   * @public
   * @memberof PictureService
   */
  public getOne = async (id: number) => this.pictureRepository.createQueryBuilder('picture')
    .where('picture.id=:id', { id })
    .leftJoinAndSelect('picture.user', 'user')
    .getOne()
}
