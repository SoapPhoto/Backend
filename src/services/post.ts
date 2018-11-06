import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Post } from '@entities/Post';

@Service()
export class PostService {
  @OrmRepository(Post)
  private postRepository: Repository<Post>;

  public getList = async () => {
    return await this.postRepository.save({
      title: 'fadsf',
      text: 'fasdf',
    });
  }
}
