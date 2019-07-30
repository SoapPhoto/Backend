import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { PictureService } from '@server/picture/picture.service';
import { UserEntity } from '@server/user/user.entity';
import { UserService } from '@server/user/user.service';
import { plainToClass } from 'class-transformer';
import Maybe from 'graphql/tsutils/Maybe';
import { CommentEntity } from './comment.entity';
import { CreatePictureCommentDot, GetPictureCommentListDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private pictureService: PictureService,
    private userService: UserService,
  ) {}

  public async getPictureList(id: string, query: GetPictureCommentListDto, _user: Maybe<UserEntity>) {
    const q = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.pictureId=:id', { id })
      .orderBy('comment.createTime', 'DESC')
      .leftJoinAndSelect('comment.user', 'user');
    this.userService.selectInfo(q);
    const [data, count] = await q.getManyAndCount();
    return listRequest(query, plainToClass(CommentEntity, data), count);
  }

  public async create(data: CreatePictureCommentDot, id: string, user: UserEntity) {
    // console.log(user, data);
    const picture = await this.pictureService.getOnePicture(id, user);
    if (picture) {
      const comment = await this.commentRepository.save(
        this.commentRepository.create({
          ...data,
          picture,
          user,
        }),
      );
      return plainToClass(CommentEntity, {
        ...comment,
        user,
      });
    }
    throw new BadGatewayException('no_picture');
  }
}
