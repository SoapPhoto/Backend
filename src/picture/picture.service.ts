import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';

import { QiniuService } from '@server/common/qiniu/qiniu.service';
import { validator } from '@server/common/utils/validator';
import { Maybe } from '@server/typing';
import { UserEntity } from '@server/user/user.entity';
import { plainToClass } from 'class-transformer';
import moment = require('moment');
import { GetPictureListDto } from './dto/picture.dto';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityService } from './user-activity/user-activity.service';

@Injectable()
export class PictureService {
  constructor(
    private readonly activityService: PictureUserActivityService,
    private readonly qiniuService: QiniuService,
    @InjectRepository(PictureEntity)
    private pictureRepository: Repository<PictureEntity>,
  ) {}
  public create = async (data: Partial<PictureEntity>) => {
    return this.pictureRepository.save(
      this.pictureRepository.create(data),
    );
  }
  public selectList = (user: Maybe<UserEntity>, query: GetPictureListDto) => {
    const q = this.pictureRepository.createQueryBuilder('picture')
      .leftJoinAndSelect('picture.user', 'user')
      .loadRelationCountAndMap(
        'picture.likes', 'picture.activitys', 'activity',
        qb => qb.andWhere('activity.like=:like', { like: true }),
      );
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
    if (query.timestamp) {
      q.where('picture.createTime <= :time', { time: query.time });
    }
    return q.skip((query.page - 1) * query.pageSize).take(query.pageSize);
  }
  public getList = async (user: Maybe<UserEntity>, query: GetPictureListDto) => {
    const data = await this.selectList(user, query).cache(true).getManyAndCount();
    return {
      data: plainToClass(PictureEntity, data[0]),
      count: data[1],
      page: query.page,
      pageSize: query.pageSize,
      timestamp: moment().valueOf(),
    };
  }

  public getOne = async (id: string | number) => {
    return this.pictureRepository.createQueryBuilder('picture')
      .where('picture.id=:id', { id })
      .leftJoinAndSelect('picture.user', 'user')
      .getOne();
  }

  public likePicture = async (id: string, user: Maybe<UserEntity>) => {
    const picture = await this.getOne(id);
    if (!picture) {
      throw new BadRequestException('no_picture');
    }
    return {
      count: await this.activityService.like(picture, user),
    };
  }

  public getUserPicture = async (id: string, query: GetPictureListDto, user: Maybe<UserEntity>) => {
    const q = this.selectList(user, query);
    if (validator.isNumberString(id)) {
      q.andWhere('picture.userId=:id', { id });
    } else {
      q.andWhere('picture.userUsername=:id', { id });
    }
    const data = await q.cache(3000).getManyAndCount();
    return {
      count: data[1],
      data: plainToClass(PictureEntity, data[0]),
      page: query.page,
      pageSize: query.pageSize,
      timestamp: new Date().getTime(),
    };
  }
  public delete = async (id: number, user: UserEntity) => {
    const data = await this.getOne(id);
    if (!data) {
      throw new BadRequestException();
    }
    if (data.user.id === user.id) {
      await getManager().transaction(async (entityManager) => {
        await this.activityService.deleteByPicture(data, entityManager);
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
}
