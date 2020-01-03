/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable, Inject, forwardRef, BadGatewayException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationType, NotificationCategory } from '@common/enum/notification';
import { FollowEntity } from './follow.entity';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { FollowUsersDto } from './dto/follow.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  public async create(user: UserEntity, followedId: number) {
    const followUser = await this.userService.findOne(followedId, null, ['badge']);
    if (!followUser) {
      throw new BadGatewayException('no_user');
    }
    await this.followRepository.save(
      this.followRepository.create({
        followed_user_id: followedId,
        follower_user_id: user.id,
      }),
    );
    this.notificationService.publishNotification(
      user,
      followUser,
      {
        type: NotificationType.USER,
        category: NotificationCategory.FOLLOW,
        mediaId: user.id,
      },
    );
  }

  public async remove(userId: number, followedId: number) {
    return this.followRepository.delete({
      followed_user_id: followedId,
      follower_user_id: userId,
    });
  }

  /**
   * 获取用户的关注或者粉丝列表
   *
   * @param {number} id
   * @param {FollowUsersDto} input
   * @param {string} [type='follower']
   * @param {boolean} [onlyId]
   * @returns
   * @memberof FollowService
   */
  public async followUsers(input: FollowUsersDto, type: string, onlyId: boolean): Promise<string[]>

  // eslint-disable-next-line no-dupe-class-members
  public async followUsers(input: FollowUsersDto, type?: string): Promise<UserEntity[]>

  // eslint-disable-next-line no-dupe-class-members
  public async followUsers({ id, limit, offset }: FollowUsersDto, type = 'follower', onlyId?: boolean) {
    let queryId = 'follower_user_id';
    let getId = 'followed_user_id';
    if (type === 'follower') {
      queryId = 'followed_user_id';
      getId = 'follower_user_id';
    }
    const q = await this.followRepository.createQueryBuilder('follow')
      .where(`follow.${queryId} = :id`, { id })
      .cache(5000);
    const [ids] = await Promise.all([
      q
        .select(`\`follow\`.\`${getId}\``)
        .limit(limit)
        .offset(offset)
        .getRawMany(),
    ]);
    if (ids.length === 0) return [];
    if (onlyId) return ids.map(v => v[getId]) as string[];
    const data = await this.userService.getRawIdsList(ids.map(v => v[getId]), null);
    return data;
  }

  public async followerCount(userId: number) {
    return this.followRepository.createQueryBuilder('follow')
      .where('follow.followed_user_id=:userId', { userId })
      .cache(5000)
      .getCount();
  }

  public async followedCount(userId: number) {
    return this.followRepository.createQueryBuilder('follow')
      .where('follow.follower_user_id=:userId', { userId })
      .cache(5000)
      .getCount();
  }

  public async isFollowing(user: UserEntity, followedId: number) {
    const follow = await this.followRepository.findOne({
      where: {
        followed_user_id: followedId,
        follower_user_id: user.id,
      },
    });
    if (follow) {
      const mutual = await this.followRepository.findOne({
        where: {
          followed_user_id: user.id,
          follower_user_id: followedId,
        },
      });
      return mutual ? 2 : 1;
    }
    return follow ? 1 : 0;
  }
}
