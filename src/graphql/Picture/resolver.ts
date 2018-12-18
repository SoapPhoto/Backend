import * as path from 'path';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import { Picture, PictureInfo } from '@entities/Picture';
import { PictureService } from '@services/Picture';
import { qiniuUpload } from '@utils/qiniu';
import { storeUpload } from '@utils/upload';
import { GraphQLUpload } from 'apollo-server-core';
import { Upload } from 'typing';

@Service()
@Resolver(of => Picture)
export class PictureResolver {
  @Inject()
  public pictureService: PictureService;

  @Query(returns => [Picture])
  public async pictures() {
    return await this.pictureService.getList();
  }

  @Query(returns => Picture)
  public async picture(
    @Arg('id') id: string,
  ) {
    return await this.pictureService.getOne(id);
  }

  @Mutation(returns => Picture)
  public async upload(
    @Arg('file', type => GraphQLUpload) file: Upload,
    @Arg('info') info: PictureInfo,
    @Ctx() context: any,
  ): Promise<any> {
    try {
      const oauth = await import('../../oauth');
      await oauth.default.authenticate(context.req, context.res, ['user', 'admin']);
      const { id, pathname } = await storeUpload(file.stream, file.filename, path.join(__dirname, '../../../upload'));
      const data = await qiniuUpload(pathname, id);
      console.log(data);
      const picture = await this.pictureService.add({
        info,
        key: data.key,
        hash: data.hash,
        user: context.req.auth.user.id,
      });
      return picture;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
