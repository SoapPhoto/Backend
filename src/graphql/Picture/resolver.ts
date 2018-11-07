import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Picture } from '@entities/Picture';
import { PictureService } from '@services/Picture';
import { PictureInput } from './input';

@Service()
@Resolver(of => Picture)
export class PictureResolver {
  @Inject()
  public pictureService: PictureService;

  @Query(returns => [Picture])
  public getList() {
    return this.pictureService.getList();
  }

  @Mutation(returns => Picture)
  public async addRecipe(@Arg('picture') picture: PictureInput): Promise<PictureInput> {
    const data = await this.pictureService.add(picture);
    return data;
  }
}
