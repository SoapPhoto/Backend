import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PictureService } from '@server/modules/picture/picture.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService
  ) {}

  public async createTag(tag: Partial<TagEntity>): Promise<TagEntity> {
    let tagData: TagEntity | undefined;
    if (tag.id) {
      tagData = await this.tagRepository.findOne(tag.id);
    } else if (tag.name) {
      tagData = await this.tagRepository.findOne({
        name: tag.name,
      });
    }
    if (!tagData) {
      tagData = await this.tagRepository.save(
        this.tagRepository.create({ name: tag.name })
      );
    }
    return tagData!;
  }

  public async getTagInfo(name: string, _user: Maybe<UserEntity>) {
    return this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name=:name', { name })
      .loadRelationCountAndMap(
        'tag.pictureCount',
        'tag.pictures',
        'picture',
        (qb) =>
          qb.where('picture.isPrivate = 0').andWhere('picture.deleted = 0')
      )
      .getOne();
  }
}
