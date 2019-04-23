import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@/user/user.entity';
import { plainToClass } from 'class-transformer';
import { PictureEntity } from './picture.entity';
import { PictureUserActivityEntity } from './user-activity/user-activity.entity';
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
  public getList = async (user?: UserEntity) => {
    const list = await this.pictureRepository.createQueryBuilder('picture')
      .leftJoinAndSelect('picture.user', 'user')
      .leftJoinAndSelect('picture.activitys', 'activity', 'activity.like=:like', { like: true })
      .addSelect(
        subQuery => subQuery.select('COUNT(*)', 'likes')
          .from(PictureUserActivityEntity, 'picture')
          .where('picture.like=:like', { like: true })
        , 'likes',
      )
      .getMany();
    console.log(list);
    // if (user) {
    //   const data = await Promise.all(
    //     list.map(async ({ id }) => await this.activityService.getOne(id, user.id)),
    //   );
    //   for (const activity of data) {
    //     if (activity) {
    //       const index = list.findIndex(({ id }) => id === activity.picture.id);
    //       list[index].like = activity.like;
    //     }
    //   }
    // }
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
}
