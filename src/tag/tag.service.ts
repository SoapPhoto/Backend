import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
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
}
