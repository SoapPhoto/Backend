import { Get, JsonController } from 'routing-controllers';
import { Inject } from 'typedi';

import { PostService } from '@services/post';

@JsonController('/post')
export class PostController {
  @Inject()
  public postService: PostService;

  @Get('/')
	public getAll(): Promise<any> {
    return this.postService.getList();
  }
}
