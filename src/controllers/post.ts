import { Get, JsonController } from 'routing-controllers';
import { Inject } from 'typedi';

import { PictureService } from '@services/picture';

@JsonController('/post')
export class PostController {
  @Inject()
  public pictureService: PictureService;

  @Get('/')
	public getAll(): Promise<any> {
    return this.pictureService.getList();
  }
}
