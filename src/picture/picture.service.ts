import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { validator } from '@server/common/utils/validator';
import { QiniuService } from '@server/shared/qiniu/qiniu.service';
import { GetTagPictureListDto } from '@server/tag/dto/tag.dto';
import { TagService } from '@server/tag/tag.service';
import { UserEntity } from '@server/user/user.entity';
import { UserService } from '@server/user/user.service';
import { Maybe } from '@typings/index';
import { plainToClass } from 'class-transformer';
import moment from 'moment';
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
    if (Array.isArray(data.tags)) {
      data.tags = await Promise.all(data.tags.map(tag => this.tagService.createTag(tag)));
    }
    const createData = await this.pictureRepository.save(
      this.pictureRepository.create(data),
    );
    return plainToClass(PictureEntity, createData);
  }
  public getList = async (user: Maybe<UserEntity>, query: GetPictureListDto) => {
    const [data, count] = await this.selectList(user, query)
      .andWhere('picture.isPrivate=:private', { private: false })
      .getManyAndCount();
    return listRequest(query, plainToClass(PictureEntity, data), count);
  }

  public addViewCount(id: number) {
    return this.pictureRepository.manager.query(`UPDATE picture SET views = views + 1 WHERE id = ${id}`);
  }

  public getOnePicture = async (id: string, user: Maybe<UserEntity>, view: boolean = false) => {
    const q = this.select(user)
      .andWhere('picture.id=:id', { id })
      .leftJoinAndSelect('picture.tags', 'tag');
    const data = await q.cache(100).getOne();
    if (view && data) {
      this.addViewCount(data.id);
      data.views += 1;
    }
    return plainToClass(PictureEntity, data);
  }

  public likePicture = async (id: string, user: UserEntity) => {
    const picture = await this.getOne(id);
    if (!picture) {
      throw new BadRequestException('no_picture');
    }
    return {
      count: await this.activityService.like(picture, user),
    };
  }

  public getUserPicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const q = this.selectList(user, query);
    let isMe = false;
    if (validator.isNumberString(idOrName)) {
      if (user && user.id === idOrName) {
        isMe = true;
      }
      q.andWhere('picture.userId=:id', { id: idOrName });
    } else {
      if (user && user.username === idOrName) {
        isMe = true;
      }
      q.andWhere('picture.userUsername=:id', { id: idOrName });
    }
    if (!isMe) {
      q.andWhere('picture.isPrivate=:private', { private: false });
    }
    const [data, count] = await q.cache(100).getManyAndCount();
    return listRequest(query, plainToClass(PictureEntity, data), count);
  }

  public getUserLikePicture = async (idOrName: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const [count, ids] = await this.activityService.getLikeList(idOrName, query);
    if (ids.length === 0) {
      return {
        count,
        data: [],
        page: query.page,
        pageSize: query.pageSize,
        timestamp: new Date().getTime(),
      };
    }
    const q = this.selectList(user);
    q.andWhere('picture.id IN (:...ids)', { ids });
    const data = await q.getMany();
    return listRequest(query, plainToClass(PictureEntity, data), count as number);
  }

  public getTagPictureList = async (name: string, user: Maybe<UserEntity>, query: GetTagPictureListDto) => {
    const q = this.selectList(user);
    const [data, count] = await q
      .innerJoinAndSelect('picture.tags', 'tags', 'tags.name=:name', { name })
      .getManyAndCount();
    return listRequest(query, plainToClass(PictureEntity, data), count);
  }

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
  public select = (user: Maybe<UserEntity>) => {
    const q = this.pictureRepository.createQueryBuilder('picture')
      .leftJoinAndSelect('picture.user', 'user')
      .loadRelationCountAndMap(
        'picture.likes', 'picture.activitys', 'activity',
        qb => qb.andWhere('activity.like=:like', { like: true }),
      );
    this.userService.selectInfo(q);
    if (user) {
      q
        .loadRelationCountAndMap(
          'picture.isLike', 'picture.activitys', 'activity',
          qb => qb.andWhere(
            'activity.userId=:userId AND activity.like=:like',
            { userId: user.id, like: true },
          ),
        );
    }
    q.orderBy('picture.createTime', 'DESC');
    return q;
  }
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

  private getOne = async (id: string | number) => {
    return this.pictureRepository.createQueryBuilder('picture')
      .where('picture.id=:id', { id })
      .leftJoinAndSelect('picture.user', 'user')
      .getOne();
  }
}
