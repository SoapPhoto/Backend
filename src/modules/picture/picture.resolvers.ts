import {
  Args, Mutation, Query, Resolver, ResolveField, Parent, Info,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { createCanvas, createImageData } from 'canvas';

import {
  UseGuards, Inject, forwardRef,
} from '@nestjs/common';
import { Roles } from '@server/common/decorator/roles.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { PicturesType } from '@common/enum/picture';
import { User } from '@server/common/decorator/user.decorator';
import { Loader } from '@server/shared/graphql/loader/loader.decorator';
import DataLoader from 'dataloader';
import { decode } from 'blurhash';
import {
  GetPictureListDto, GetUserPictureListDto, UpdatePictureDot, GetNewPictureListDto,
} from './dto/picture.dto';
import { PictureService } from './picture.service';
import { CollectionService } from '../collection/collection.service';
import { PictureEntity } from './picture.entity';
import { CommentService } from '../comment/comment.service';
import { BadgeService } from '../badge/badge.service';
import { BadgePictureLoader } from '../badge/badge.loader';
import { BadgeEntity } from '../badge/badge.entity';

@Resolver('Picture')
@UseGuards(AuthGuard)
export class PictureResolver {
  constructor(
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,
    private readonly pictureService: PictureService,
    @Inject(forwardRef(() => BadgeService))
    private readonly badgeService: BadgeService,
  ) { }

  @Query()
  public async searchPictures(
    @User() user: Maybe<UserEntity>,
    @Args('query') query: GetPictureListDto,
    @Args('words') words: string,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.pictureService.search(words, query, user, info);
  }


  @Query()
  public async pictures(
    @User() user: Maybe<UserEntity>,
    @Args('query') query: GetPictureListDto,
    @Info() info: GraphQLResolveInfo,
      @Args('type') type: PicturesType = PicturesType.HOT,
  ) {
    if (type === PicturesType.HOT) {
      return this.pictureService.getPictureHotInfoList(user, query, info);
    }
    return this.pictureService.find(user, type, query, info);
  }

  @Query()
  public async newPictures(
    @User() user: Maybe<UserEntity>,
    @Args('query') query: GetNewPictureListDto,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.pictureService.getNewList(user, query, info);
  }

  @Query()
  public async userPictures(
    @User() user: Maybe<UserEntity>,
    @Args('id') id: string,
    @Args('username') username: string,
    @Args('query') query: GetUserPictureListDto,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.pictureService.getUserPicture(id || username, query, user, info);
  }

  @Query()
  public async picture(
    @User() user: Maybe<UserEntity>,
    @Info() info: GraphQLResolveInfo,
    @Args('id') id: number,
  ) {
    this.pictureService.addViewCount(id);
    return this.pictureService.findOne(id, user, true, info);
  }

  @Query()
  public async pictureRelatedCollection(
    @Args('id') id: number,
  ) {
    return this.collectionService.pictureRelatedCollection(id);
  }

  @Mutation()
  @Roles(Role.USER)
  public async likePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
  ) {
    return this.pictureService.likePicture(id, user, true);
  }

  @Mutation()
  @Roles(Role.USER)
  public async unlikePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
  ) {
    return this.pictureService.likePicture(id, user, false);
  }

  @Mutation()
  @Roles(Role.USER)
  public async updatePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
    @Args('data') data: UpdatePictureDot,
  ) {
    return this.pictureService.update(id, data, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async deletePicture(
    @User() user: UserEntity,
    @Args('id') id: number,
  ) {
    return this.pictureService.delete(id, user);
  }

  @ResolveField('commentCount')
  public async commentCount(
    @Parent() parent: PictureEntity,
  ) {
    return this.commentService.getPictureCommentCount(parent.id);
  }

  @ResolveField('currentCollections')
  public async currentCollections(
    @Parent() parent: PictureEntity,
    @User() user?: UserEntity,
  ) {
    if (!user) return [];
    return this.pictureService.getCurrentCollections(parent.id, user);
  }

  @ResolveField('badge')
  public async badge(
    @Parent() parent: PictureEntity,
    @Loader(BadgePictureLoader.name) badgeLoader: DataLoader<BadgeEntity['id'], BadgeEntity>,
  ) {
    return badgeLoader.load(parent.id);
  }

  @ResolveField('blurhashSrc')
  public async blurhashSrc(
    @Parent() parent: PictureEntity,
  ) {
    const getBase64 = (str: string, width: number, height: number) => {
      const pixels = decode(str, width, height);
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.putImageData(createImageData(pixels, width, height), 0, 0);
      const base64 = canvas.toDataURL();
      return base64;
    };
    if (parent.blurhash) {
      let s = 1;
      let width = 8;
      let height = 8;
      if (parent.width > parent.height) {
        s = Math.round(parent.width / parent.height);
        width *= s;
      } else {
        s = Math.round(parent.height / parent.width);
        height *= s;
      }
      const base64 = getBase64(parent.blurhash, width, height);
      return base64;
    }
    return undefined;
    // return badgeLoader.load(parent.id);
  }
}
