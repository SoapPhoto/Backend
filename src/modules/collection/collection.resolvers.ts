import {
  Args, Context, Query, Resolver, Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Roles } from '@server/common/decorator/roles.decorator';
import { CollectionService } from './collection.service';
import { UserEntity } from '../user/user.entity';
import { GetCollectionPictureListDto } from './dto/collection.dto';
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
    @Args('id') id: string,
  ) {
    return this.collectionService.getCollectionDetail(id, user);
  }

  @Query()
  public async collectionPictures(
    @Context('user') user: Maybe<UserEntity>,
    @Args('query') query: GetCollectionPictureListDto,
    @Args('id') id: string,
  ) {
    return this.collectionService.getCollectionPictureList(id, query, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async addPictureCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
    @Args('pictureId') pictureId: string,
  ) {
    return this.collectionService.addPicture(id, pictureId, user);
  }

  @Mutation()
  @Roles(Role.USER)
  public async removePictureCollection(
    @Context('user') user: UserEntity,
    @Args('id') id: string,
    @Args('pictureId') pictureId: string,
  ) {
    await this.collectionService.removePicture(id, pictureId, user);
    return {
      done: true,
    };
  }
}
