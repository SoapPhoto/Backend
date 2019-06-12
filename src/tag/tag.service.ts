import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Repository } from 'typeorm';

import { PictureEntity } from '@server/picture/picture.entity';
import { PictureService } from '@server/picture/picture.service';
import { UserEntity } from '@server/user/user.entity';
import { Maybe } from '@typings/index';
import { plainToClass } from 'class-transformer';
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
  public async getTagInfo(name: string, user: Maybe<UserEntity>) {
    return this.tagRepository.createQueryBuilder('tag')
      .where('tag.name=:name', { name })
      .getOne();
  }
  public async getTagPicture(name: string, user: Maybe<UserEntity>, query: GetTagPictureListDto) {
    // tslint:disable-next-line: max-line-length
    const pictureId = await this.tagRepository.manager.query(`SELECT tags.pictureId AS id FROM picture_tags tags WHERE tags.tagName='${name}'`);
    const q = this.pictureService.select(user);
    const data = await q
      .andWhere('picture.id IN (:...ids)', { ids: pictureId.map((id: any) => id.id) })
      .skip((query.page - 1) * query.pageSize)
      .take(query.pageSize)
      .getManyAndCount();
    return {
      data: plainToClass(PictureEntity, data[0]),
      count: data[1],
      page: query.page,
      pageSize: query.pageSize,
      timestamp: moment().valueOf(),
    };
  }
}
