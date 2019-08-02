import { classToPlain } from 'class-transformer';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository, SelectQueryBuilder } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { validator } from '@server/common/utils/validator';
import { QiniuService } from '@server/shared/qiniu/qiniu.service';
import { GetTagPictureListDto } from '@server/modules/tag/dto/tag.dto';
import { TagService } from '@server/modules/tag/tag.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { CollectionPictureEntity } from '@server/modules/collection/picture/collection-picture.entity';
import { GetPictureListDto } from './dto/picture.dto';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityService } from './user-activity/user-activity.service';

@Injectable()
export class PictureService {
  constructor(
    private readonly activityService: PictureUserActivityService,
    private readonly qiniuService: QiniuService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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
    return classToPlain(createData);
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
    return listRequest(query, classToPlain(data), count);
  }

  /**
   * 增加阅读数量
   *
   * @param {number} id
   * @returns
   * @memberof PictureService
   */
  public addViewCount(id: number) {
    return this.pictureRepository.manager.query(`UPDATE picture SET views = views + 1 WHERE id = ${id}`);
  }

  /**
   * 获取单个图片的信息
   *
   * @memberof PictureService
   */
  public getOnePicture = async (id: string, user: Maybe<UserEntity>, view: boolean = false) => {
    const q = this.select(user)
      .andWhere('picture.id=:id', { id })
      .leftJoinAndSelect('picture.tags', 'tag');
    const data = await q.cache(100).getOne();
    if (view && data) {
      this.addViewCount(data.id);
      data.views += 1;
    }
    const isUser = data && data.user.id === (user ? user.id : null);
    if (data && data.isPrivate && !isUser) {
      throw new NotFoundException();
    }
    return classToPlain(data);
  }

  /**
   * 喜欢图片
   *
   * @memberof PictureService
   */
  public likePicture = async (id: string, user: UserEntity) => {
    const picture = await this.getOne(id);
    if (!picture) {
      throw new BadRequestException('no_picture');
    }
    return this.activityService.like(picture, user);
  }

  /**
   * 获取某个用户的图片列表
   *
   * @memberof PictureService
   */
  public getUserPicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const q = this.selectList(user, query);
    let isMe = false;
    if (validator.isNumberString(idOrName)) {
      if (user && user.id === idOrName) isMe = true;
      q.andWhere('picture.userId=:id', { id: idOrName });
    } else {
      if (user && user.username === idOrName) isMe = true;
      q.andWhere('picture.userUsername=:id', { id: idOrName });
    }
    if (!isMe) {
      q.andWhere('picture.isPrivate=:private', { private: false });
    }
    const [data, count] = await q.cache(100).getManyAndCount();
    return listRequest(query, classToPlain(data), count);
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
      await getManager().transaction(async (entityManager) => {
        await Promise.all([
          entityManager.remove(data),
          this.qiniuService.deleteFile(data.key),
        ]);
      });
      return {
        message: 'ok',
      };
    }
    throw new UnauthorizedException();
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
  public selectInfo = <T>(q: SelectQueryBuilder<T>, user: Maybe<UserEntity>, value: string = 'user') => {
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
