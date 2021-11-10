import {
  classToPlain, plainToClass,
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
import nodejieba from 'nodejieba';
import { RedisManager } from '@liaoliaots/nestjs-redis';
import { fieldsProjection } from 'graphql-fields-list';
import { isNumberString } from 'class-validator';

import { listRequest } from '@server/common/utils/request';
import { GetTagPictureListDto } from '@server/modules/tag/dto/tag.dto';
import { TagService } from '@server/modules/tag/tag.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { keyword } from '@server/common/utils/keyword';
import { LoggingService } from '@server/shared/logging/logging.service';
import { isBoolean, uniq } from 'lodash';
import { PicturesType } from '@common/enum/picture';
import { GraphQLResolveInfo } from 'graphql';
import { PaginationDto } from '@server/common/dto/pagination.dto';
import { BaiduClassify } from '@server/shared/baidu/interface/baidu.interface';
import { platform } from 'os';
import { GetPictureListDto, UpdatePictureDot, GetNewPictureListDto } from './dto/picture.dto';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityService } from './user-activity/user-activity.service';
import { Role } from '../user/enum/role.enum';
import { CollectionService } from '../collection/collection.service';
import { CommentService } from '../comment/comment.service';
import { BadgeService } from '../badge/badge.service';
import { FollowService } from '../follow/follow.service';
import { BadgeEntity } from '../badge/badge.entity';
import { PictureBadgeActivityEntity } from '../badge/picture-badge-activity/picture-badge-activity.entity';

@Injectable()
export class PictureService {
  constructor(
    private readonly logger: LoggingService,
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
    @Inject(forwardRef(() => FollowService))
    private readonly followService: FollowService,
    @InjectRepository(PictureEntity)
    private pictureRepository: Repository<PictureEntity>,
    private readonly redisManager: RedisManager,
  ) { }

  public getPictureKeyword(picture: PictureEntity) {
    const keywords = keyword([picture.title, picture.bio]);
    const key = [...new Set(keywords), ...new Set((picture.classify || []).map(v => v.keyword))].join('|');
    return key;
  }

  public async create(data: Partial<PictureEntity>) {
    const newData = { ...data };
    const keywords = keyword([newData.title, newData.bio]);
    if (Array.isArray(data.tags)) {
      newData.tags = await Promise.all(data.tags.map(tag => this.tagService.createTag(tag)));
      keywords.unshift(...newData.tags.map(tag => tag.name));
    }
    newData.keywords = [...new Set(keywords), ...new Set((newData.classify || []).map(v => v.keyword))].join('|');
    const picture = await this.pictureRepository.save(
      this.pictureRepository.create(newData),
    );
    return picture;
  }

  public async update(id: number, { tags, ...data }: UpdatePictureDot, user: UserEntity) {
    const picture = await this.pictureRepository.createQueryBuilder('picture')
      .where('picture.id=:id', { id })
      .andWhere('picture.deleted = 0')
      .leftJoinAndSelect('picture.user', 'user')
      .getOne();
    if (!picture || picture.user.id !== user.id) {
      throw new ForbiddenException();
    }
    const updateData: Partial<PictureEntity> = data;
    const keywords = keyword([updateData.title, updateData.bio]);
    if (tags.length > 0) {
      const newTags = await Promise.all(
        (tags as string[]).map((tag: string) => this.tagService.createTag({ name: tag })),
      );
      updateData.tags = newTags;
    } else {
      updateData.tags = [];
    }
    keywords.unshift(...updateData.tags.map(tag => tag.name));
    updateData.keywords = [...new Set(keywords)].join('|');
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

  public search = async (words: string, query: GetPictureListDto, user: Maybe<UserEntity>, info: GraphQLResolveInfo) => {
    const { length } = words;
    const splicedWords: string[] = nodejieba.extract(words, 20).map((v: any) => v.word);
    // eslint-disable-next-line no-restricted-syntax
    // for (const whiteSpaceSpliced of words.split(/\s+/)) {
    //   splicedWords.push(...nodejieba.tag(whiteSpaceSpliced).map((v: any) => v.word));
    // }
    const q = this.selectList(user, query, { info, path: 'data' });
    this.logger.warn(`${words}=${splicedWords.toString()}`, 'search-info');
    if (length > 1 && splicedWords.length > 1) {
      q.andWhere(`MATCH(keywords) AGAINST('+${splicedWords.map(v => `${v}*`).join(' ~')}' IN boolean MODE)`);
    } else if (length > 1) {
      q.andWhere(`MATCH(keywords) AGAINST('+${splicedWords[0]}*' IN boolean MODE)`);
    } else {
      q.andWhere(`keywords like '%${words}%'`);
    }
    const [data, count] = await q.andWhere('picture.isPrivate=:private', { private: false })
      .andWhere('picture.deleted = 0')
      .cache(3000)
      .getManyAndCount();
    return listRequest(query, data, count);
  }

  public getNewList = async (user: Maybe<UserEntity>, query: GetNewPictureListDto, info: GraphQLResolveInfo) => {
    const q = this.selectList(user, { ...query, timestamp: undefined } as GetNewPictureListDto, { info, path: 'data' })
      .andWhere('picture.isPrivate=:private', { private: false })
      .andWhere('picture.createTime > :after', { after: query.lastTime })
      .andWhere('picture.createTime <= :before', { before: query.time })
      .andWhere('picture.deleted = 0');
    const [data, count] = await q.getManyAndCount();
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
   * 获取单个图片信息
   *
   * @param {number} id
   * @param {Maybe<UserEntity>} user
   * @param {boolean} toPlain
   * @param {GraphQLResolveInfo} [select]
   * @returns {Promise<Record<string, any>>}
   * @memberof PictureService
   */
  public async findOne(id: number, user: Maybe<UserEntity>, select?: GraphQLResolveInfo): Promise<PictureEntity>

  /**
   * 获取单个图片信息
   *
   * @param {number} id
   * @param {Maybe<UserEntity>} user
   * @param {boolean} toPlain
   * @param {GraphQLResolveInfo} [select]
   * @returns {Promise<Record<string, any>>}
   * @memberof PictureService
   */
  // eslint-disable-next-line no-dupe-class-members
  public async findOne(id: number, user: Maybe<UserEntity>, toPlain: boolean, info?: GraphQLResolveInfo): Promise<Record<string, any>>

  /**
   * 获取单个图片信息
   *
   * @param {number} id
   * @param {Maybe<UserEntity>} user
   * @param {(boolean | GraphQLResolveInfo)} [toPlain]
   * @param {GraphQLResolveInfo} [select]
   * @returns
   * @memberof PictureService
   */
  // eslint-disable-next-line no-dupe-class-members
  public async findOne(id: number, user: Maybe<UserEntity>, toPlain?: boolean | GraphQLResolveInfo, info?: GraphQLResolveInfo) {
    const q = this.select(user, {
      value: '',
      info: isBoolean(toPlain) ? info : toPlain,
    })
      .andWhere('picture.id=:id', { id })
      .leftJoinAndSelect('picture.tags', 'tag');
    const data = await q.cache(100).getOne();
    const isOwner = data && data.user.id === (user ? user.id : null);
    if (!data || (data && data.isPrivate && !isOwner)) {
      throw new NotFoundException();
    }
    if (isBoolean(toPlain)) {
      return classToPlain(data, {
        groups: isOwner ? [Role.OWNER] : [],
      });
    }
    return data;
  }

  public async find(user: Maybe<UserEntity>, type: PicturesType, query: GetNewPictureListDto, info: GraphQLResolveInfo) {
    const q = this.selectList(user, query, { info, value: 'user', path: 'data' })
      .andWhere('picture.isPrivate=:private', { private: false })
      .andWhere('picture.deleted = 0');
    if (type === PicturesType.CHOICE) {
      q.leftJoin(this.badgeService.pictureActivityMetadata.tableName, 'badgeActivity', 'badgeActivity.pictureId=picture.id')
        .andWhere('badgeActivity.pictureId=picture.id', { private: false });
    }
    if (type === PicturesType.FEED) {
      if (!user) throw new ForbiddenException();
      const fq = plainToClass(PaginationDto, { page: 1, pageSize: 100000000 });
      const ids = await this.followService.followUsers(user.id, fq, 'followed', true);
      if (ids.length === 0) return listRequest(query, [], 0);
      q.andWhere('picture.userId IN (:ids)', { ids });
    }
    const [data, count] = await q.getManyAndCount();
    return listRequest(query, data, count);
  }

  /**
   * 喜欢图片
   *
   * @memberof PictureService
   */
  public likePicture = async (id: number, user: UserEntity, data: boolean) => {
    const picture = await this.findOne(id, user);
    if (!picture) {
      throw new BadRequestException('no_exist_picture');
    }
    const likeData = await this.activityService.like(picture, user, data);
    picture.isLike = likeData.isLike;
    picture.likedCount = likeData.count;
    return picture;
  }

  /**
   * 获取某个用户的图片列表
   *
   * @memberof PictureService
   */
  public getUserPicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>, info: GraphQLResolveInfo) => {
    const q = this.selectList(user, query, { info, path: 'data' })
      .andWhere('picture.deleted = 0');
    let isOwner = false;
    if (isNumberString(idOrName)) {
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
   * 获取用户订阅的图片列表（
   *
   * @param {UserEntity} user
   * @param {GetPictureListDto} query
   * @memberof PictureService
   */
  public async getFeedPictures(user: UserEntity, query: GetPictureListDto, info: GraphQLResolveInfo) {
    const fq = plainToClass(PaginationDto, { page: 1, pageSize: 100000000 });
    const ids = await this.followService.followUsers(user.id, fq, 'followed', true);
    if (ids.length === 0) return listRequest(query, [], 0);
    const q = this.selectList(user, query, { info, path: 'data' })
      .where('picture.userId IN (:ids)', { ids })
      .andWhere('picture.deleted = 0');
    const [data, count] = await q.cache(5000).getManyAndCount();
    return listRequest(query, classToPlain(data), count);
  }

  /**
   * 某个用户喜欢的图片列表
   *
   * @memberof PictureService
   */
  public getUserLikePicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>, info: GraphQLResolveInfo) => {
    const [count, ids] = await this.activityService.getLikeList(idOrName, query, user);
    if (ids.length === 0) {
      return listRequest(query, [], count as number);
    }
    const q = this.selectList(user, query, { info, path: 'data' })
      .where('picture.id IN (:...ids)', { ids })
      .andWhere('picture.deleted = 0');
    const data = await q.getMany();
    return listRequest(query, classToPlain(data), count as number);
  }

  /**
   * 某个用户喜精选的图片列表
   *
   * @memberof PictureService
   */
  public getUserChoicePicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>, info: GraphQLResolveInfo) => {
    const q = this.selectList(user, query, { info, path: 'data' });
    let isOwner = false;
    if (isNumberString(idOrName)) {
      if (user && user.id.toString() === idOrName) isOwner = true;
      q.andWhere('picture.userId=:id', { id: idOrName });
    } else {
      if (user && user.username === idOrName) isOwner = true;
      q.andWhere('picture.userUsername=:id', { id: idOrName });
    }
    if (!isOwner) {
      q.andWhere('picture.isPrivate=:private', { private: false });
    }
    q.leftJoin(this.badgeService.pictureActivityMetadata.tableName, 'badgeActivity', 'badgeActivity.pictureId=picture.id')
      .andWhere('badgeActivity.pictureId=picture.id AND badgeActivity.badgeId=1')
      .andWhere('picture.deleted = 0');
    const [data, count] = await q.cache(100).getManyAndCount();
    return listRequest(query, classToPlain(data, {
      groups: isOwner ? [Role.OWNER] : undefined,
    }), count);
  }

  /**
   * 获取某个标签的图片列表
   *
   * @memberof PictureService
   */
  public getTagPictureList = async (name: string, user: Maybe<UserEntity>, query: GetTagPictureListDto, info: GraphQLResolveInfo) => {
    const q = this.selectList(user, query, { info, path: 'data' });
    const [data, count] = await q
      .innerJoinAndSelect('picture.tags', 'tags', 'tags.name=:name', { name })
      .andWhere('picture.deleted = 0')
      .andWhere('picture.isPrivate=:private', { private: false })
      .getManyAndCount();
    return listRequest(query, classToPlain(data), count);
  }

  /**
   * 获取图片相似图片列表
   *
   * @memberof PictureService
   */
  public getPictureRelated = async (id: number, limit: number, user: Maybe<UserEntity>, info: GraphQLResolveInfo) => {
    const userData = await this.findOne(id, null);
    // let tag: string[] = [];
    // nodejieba.tag(userData.title).forEach(v => tag.push(v.word));
    // userData.tags.forEach(v => tag.push(v.name));
    // tag = uniq(tag);
    const q = this.selectList(user, plainToClass(PaginationDto, {
      page: 1,
      pageSize: limit,
    }), { info, orderBy: true });
    // this.logger.warn(`${words}=${splicedWords.toString()}`, 'search-info');
    q.andWhere(`MATCH(keywords) AGAINST('${userData.keywords.split('|').map(v => `>${v}`).join(' ')}' IN boolean MODE)`)
      .andWhere('picture.id != :id', { id });
    const data = await q.andWhere('picture.isPrivate=:private', { private: false })
      .andWhere('picture.deleted = 0')
      .cache(3000)
      .getMany();
    return data;
  }

  /**
   * 删除图片
   *
   * @memberof PictureService
   */
  public delete = async (id: number, user: UserEntity) => {
    const data = await this.findOne(id, user);
    if (!data) {
      throw new BadRequestException();
    }
    if (data.user.id === user.id) {
      await this.pictureRepository.createQueryBuilder()
        .update()
        .set({
          deleted: 1,
        })
        .where('id = :id', { id })
        .execute();
      return {
        done: true,
      };
    }
    throw new ForbiddenException();
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
      .where('picture.userUsername=:username AND picture.deleted = 0', { username })
      .andWhere('picture.deleted = 0')
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

  public getPictureHotInfoList = async (user: Maybe<UserEntity>, query: GetPictureListDto, info: GraphQLResolveInfo) => {
    const client = this.redisManager.getClient();
    const limit = (query.page - 1) * query.pageSize;
    const [ids, count] = await Promise.all([
      client.zrevrange('picture_hot', limit, limit + query.pageSize - 1),
      client.zcount('picture_hot', -1000000, 1000000),
    ]);
    const q = this.pictureRepository.createQueryBuilder('picture');
    this.selectInfo(q, user, { info, path: 'data' });
    // q.whereInIds(ids)
    q.where(`picture.id IN (${ids.toString()})`)
      .andWhere('picture.deleted = 0')
      .andWhere('picture.isPrivate=0')
      .orderBy(`FIELD(\`picture\`.\`id\`, ${ids.toString()})`)
      .cache(1000);
    const data = await q.getMany();
    return listRequest(query, classToPlain(data), count as number);
  }

  public getCollectionPictureListQuery = (id: number, user: Maybe<UserEntity>, info: GraphQLResolveInfo) => {
    const q = this.pictureRepository.createQueryBuilder('picture')
      .leftJoin(this.collectionService.activityMetadata.tableName, 'collectionActivity', 'collectionActivity.pictureId=picture.id')
      .leftJoin(this.collectionService.metadata.tableName, 'collection', 'collection.id=collectionActivity.collectionId')
      .where('collection.id=:id', { id });
    this.selectInfo(q, user, { info, path: 'data' });
    return q;
  }

  /**
   * 计算热门图片
   *
   * @returns
   * @memberof PictureService
   */
  public async calculateHotPictures() {
    const data = await this.pictureRepository.createQueryBuilder('picture')
      .where('picture.isPrivate=:isPrivate', { isPrivate: false })
      .andWhere('picture.deleted = 0')
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
   * 图片的初始查询条件
   *
   * @memberof PictureService
   */
  public select = (user: Maybe<UserEntity>, options?: ISelectOptions) => {
    const q = this.pictureRepository.createQueryBuilder('picture')
      .andWhere('picture.deleted = 0');
    if (!options?.orderBy) {
      q.orderBy('picture.createTime', 'DESC');
    }
    this.selectInfo(q, user, options);
    return q;
  }

  /**
   * 图片列表的初始查询条件
   *
   * @memberof PictureService
   */
  public selectList = (user: Maybe<UserEntity>, query: GetPictureListDto, options?: ISelectOptions) => {
    const q = this.select(user, options);
    if (query) {
      if (query.timestamp) {
        q.where('picture.createTime <= :time', { time: query.time });
      }
      q.skip((query.page - 1) * query.pageSize).take(query.pageSize);
    }
    return q;
  }

  /**
   * 获取图片的一些基础信息的查询，如：`likedCount`,`isLike`
   *
   * @memberof PictureService
   */
  // eslint-disable-next-line arrow-parens
  public selectInfo = <T>(q: SelectQueryBuilder<T>, user: Maybe<UserEntity>, options?: ISelectOptions) => {
    q.leftJoinAndSelect('picture.user', options?.value || 'user')
      .andWhere('picture.deleted = 0');
    if (options && options.info) {
      const pictureSelect = fieldsProjection(options.info, { path: options?.path || '' });
      const userSelect = fieldsProjection(options.info, { path: `${options?.path ? `${options?.path}.` : ''}user` });
      if (pictureSelect.likedCount) {
        q.loadRelationCountAndMap(
          'picture.likedCount', 'picture.activities', 'activity',
          qb => qb.andWhere('activity.like=:like', { like: true }),
        );
      }
      if (userSelect['badge.id']) {
        this.userService.selectBadge(q);
      }
      if (pictureSelect.isLike && user) {
        q.loadRelationCountAndMap(
          'picture.isLike', 'picture.activities', 'activity',
          qb => qb.andWhere(
            'activity.userId=:userId AND activity.like=:like',
            { userId: user.id, like: true },
          ),
        );
      }
    }
  }

  public getAllPicture = async () => this.pictureRepository.createQueryBuilder('picture')
    .getMany()

  public getNotClassifyPicture = async () => this.pictureRepository.createQueryBuilder('picture')
    .where('picture.classify is null')
    .andWhere('picture.deleted = 0')
    .orderBy('picture.createTime', 'DESC')
    .skip(0)
    .take(5)
    .getMany()

  public updateClassifyPicture = async (id: number, classify: BaiduClassify[]) => this.pictureRepository.createQueryBuilder('picture')
    .update()
    .set({ classify })
    .where('id = :id', { id })
    .execute();

  public getRawList = async () => this.pictureRepository.createQueryBuilder('picture')
    .leftJoinAndSelect('picture.tags', 'tag')
    .getMany()

  public updateRaw = async (picture: PictureEntity, updateData: Partial<PictureEntity>) => this.pictureRepository.save(
    this.pictureRepository.merge(
      picture,
      updateData,
    ),
  )

  public getPictureLikes = (id: number) => this.activityService.getLikes(id)

  public getUserIsLike = (id: number, user: UserEntity) => this.activityService.isLike(id, user)

  public userLikesCount = (id: number) => this.activityService.userLikesCount(id)

  public getPictureLikedCount = (id: number) => this.activityService.getPictureLikedCount(id)

  public getUserLikedCount = (id: number) => this.activityService.getUserLikedCount(id)
}
