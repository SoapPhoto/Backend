import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { listRequest } from '@server/common/utils/request';
import { PictureService } from '@server/modules/picture/picture.service';
import { UserEntity } from '@server/modules/user/user.entity';
import { UserService } from '@server/modules/user/user.service';
import { NotificationType, NotificationCategory } from '@common/enum/notification';
import { plainToClass } from 'class-transformer';
import { CommentEntity } from './comment.entity';
import { CreatePictureCommentDot, GetPictureCommentListDto } from './dto/comment.dto';
import { NotificationService } from '../notification/notification.service';
import { PictureEntity } from '../picture/picture.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private pictureService: PictureService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  public async getPictureList(id: string, query: GetPictureCommentListDto, _user: Maybe<UserEntity>) {
    const q = this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.pictureId=:id', { id })
      .orderBy('comment.createTime', 'DESC')
      .leftJoinAndSelect('comment.user', 'user');
    this.userService.selectInfo(q);
    const [data, count] = await q.getManyAndCount();
    return listRequest(query, data, count);
  }

  public async create(data: CreatePictureCommentDot, id: string, user: UserEntity) {
    const picture = plainToClass(
      PictureEntity,
      await this.pictureService.getOnePicture(id, user),
    );
    if (!picture || (picture && picture.isPrivate && picture.user.id !== user.id)) {
      throw new BadGatewayException('no_picture');
    }
    const isOwner = picture.user.id === user.id;
    const comment = await this.commentRepository.save(
      this.commentRepository.create({
        ...data,
        picture,
        user,
      }),
    );
    if (!isOwner) {
      this.notificationService.publishNotification(
        user,
        picture.user,
        {
          type: NotificationType.USER,
          category: NotificationCategory.COMMENT,
          mediaId: picture.id.toString(),
        },
      );
    }
    return comment;
  }
}
