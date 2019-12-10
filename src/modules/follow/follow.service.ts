/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable, Inject, forwardRef, BadGatewayException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from './follow.entity';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { FollowUsersDto } from './dto/follow.dto';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async create(userId: ID, followedId: ID) {
    const user = await this.userService.getBaseUser(followedId);
    if (!user) {
      throw new BadGatewayException('no_user');
    }
    return this.followRepository.save(
      this.followRepository.create({
        followed_user_id: followedId,
        follower_user_id: userId,
      }),
    );
  }

  public async remove(userId: ID, followedId: ID) {
    return this.followRepository.delete({
      followed_user_id: followedId,
      follower_user_id: userId,
    });
  }

  public async followUsers(id: ID, input: FollowUsersDto, type = 'follower') {
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
        .limit(input.limit)
        .offset(input.offset)
        .getRawMany(),
    ]);
    if (ids.length === 0) return [];
    const data = await this.userService.getRawIdsList(ids.map(v => v[getId]), null);
    return data;
  }

  public async followerCount(userId: ID) {
    return this.followRepository.createQueryBuilder('follow')
      .where('follow.followed_user_id=:userId', { userId })
      .cache(5000)
      .getCount();
  }

  public async followedCount(userId: ID) {
    return this.followRepository.createQueryBuilder('follow')
      .where('follow.follower_user_id=:userId', { userId })
      .cache(5000)
      .getCount();
  }

  public async isFollowing(user: UserEntity, followedId: ID) {
    const follow = await this.followRepository.findOne({
      where: {
        followed_user_id: followedId,
        follower_user_id: user.id,
      },
    });
    return Boolean(follow);
  }
}
