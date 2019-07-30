import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PictureService } from '@server/picture/picture.service';
import { UserEntity } from '@server/user/user.entity';
import { GetTagPictureListDto } from './dto/tag.dto';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @Inject(forwardRef(() => PictureService))
    private readonly pictureService: PictureService,
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
        this.tagRepository.create({ name: tag.name }),
      );
    }
    return tagData!;
  }

  public async getTagInfo(name: string, _user: Maybe<UserEntity>) {
    return this.tagRepository.createQueryBuilder('tag')
      .where('tag.name=:name', { name })
      .getOne();
  }

  public async getTagPicture(name: string, user: Maybe<UserEntity>, query: GetTagPictureListDto) {
    return this.pictureService.getTagPictureList(name, user, query);
  }
}
