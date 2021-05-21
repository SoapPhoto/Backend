import {
  Args, Context, Query, Resolver, Mutation, Info,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Roles } from '@server/common/decorator/roles.decorator';
import { GraphQLResolveInfo } from 'graphql';
import { CollectionService } from './collection.service';
import { UserEntity } from '../user/user.entity';
import { CreateCollectionDot, GetCollectionPictureListDto, UpdateCollectionDot } from './dto/collection.dto';
import { Role } from '../user/enum/role.enum';

@Resolver()
@UseGuards(AuthGuard)
export class CollectionResolver {
  constructor(
    private readonly collectionService: CollectionService,
  ) {}

  @Query()
  public async collection(
    @Context('user') user: Maybe<UserEntity>,
    @Args('id') id: number,
  ) {
    return this.collectionService.getCollectionDetail(id, user);
  }

  @Query()
  public async collectionPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('query') query: GetCollectionPictureListDto,
    @Args('id') id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return this.collectionService.getCollectionPictureList(id, query, user, info);
  }

  @Mutation()
  @Roles(Role.USER)
  public async addPictureCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: number,
    @Args('pictureId') pictureId: number,
  ) {
    return this.collectionService.addPicture(id, pictureId, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async removePictureCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: number,
    @Args('pictureId') pictureId: number,
  ) {
    await this.collectionService.removePicture(id, pictureId, user);
    return {
      done: true,
    };
  }

  @Mutation()
  @Roles(Role.USER)
  public async deleteCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: number,
  ) {
    await this.collectionService.deleteCollection(id, user);
    return {
      done: true,
    };
  }

  @Mutation()
  @Roles(Role.USER)
  public async addCollection(
    @Context('user') user: UserEntity,
    @Args('data') data: CreateCollectionDot,
  ) {
    return this.collectionService.create(data, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async updateCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: number,
    @Args('data') data: UpdateCollectionDot,
  ) {
    return this.collectionService.updateCollection(data, id, user);
  }
}
