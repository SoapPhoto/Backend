import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { validator } from '@/common/utils/validator';
import { UserEntity } from '@/user/user.entity';
import { plainToClass } from 'class-transformer';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityService } from './user-activity/user-activity.service';

@Injectable()
export class PictureService {
  constructor(
    private readonly activityService: PictureUserActivityService,
    @InjectRepository(PictureEntity)
    private pictureRepository: Repository<PictureEntity>,
  ) {}
  public create = async (data: Partial<PictureEntity>) => {
    return this.pictureRepository.save(
      this.pictureRepository.create(data),
    );
  }
  public selectList = (user?: UserEntity) => {
    const query = this.pictureRepository.createQueryBuilder('picture')
      .leftJoinAndSelect('picture.user', 'user')
      .loadRelationCountAndMap(
        'picture.likes', 'picture.activitys', 'activity',
        qb => qb.andWhere('activity.like=:like', { like: true }),
      );
    if (user) {
      query
        .loadRelationCountAndMap(
          'picture.isLike', 'picture.activitys', 'activity',
          qb => qb.andWhere(
            'activity.userId=:userId AND activity.like=:like',
            { userId: user.id, like: true },
          ),
        );
    }
    return query;
  }
  public getList = async (user?: UserEntity) => {
    const list = await this.selectList(user).cache(true).getMany();
    return plainToClass(PictureEntity, list);
  }

  public getOne = async (id: string | number) => {
    return this.pictureRepository.createQueryBuilder('picture')
      .where('picture.id=:id', { id })
      .leftJoinAndSelect('picture.user', 'user')
      .getOne();
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

  public getUserPicture = async (query: string, user?: UserEntity) => {
    const q = this.selectList(user);
    if (validator.isNumberString(query)) {
      q.where('picture.userId=:query', { query });
    } else {
      q.where('picture.userUsername=:query', { query });
    }
    const data = await q.cache(3000).getMany();
    return plainToClass(PictureEntity, data);
  }
}
