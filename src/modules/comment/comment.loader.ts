import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';

import { NestDataLoader } from '@server/shared/graphql/loader/loader.interceptor';
import { CommentEntity } from './comment.entity';
import { CommentService } from './comment.service';

export interface IChildCommentLoaderArgs {
  id: number;
  limit: number;
}

@Injectable({ scope: Scope.REQUEST })
export class ChildCommentLoader implements NestDataLoader<IChildCommentLoaderArgs, CommentEntity[]> {
  constructor(
    private readonly commentService: CommentService,
  ) { }

  public generateDataLoader() {
    return new DataLoader<IChildCommentLoaderArgs, CommentEntity[]>(keys => this.commentService.findByChildComments(keys));
  }
}

@Injectable({ scope: Scope.REQUEST })
export class CommentSubCountLoader implements NestDataLoader<number, number> {
  constructor(
    private readonly commentService: CommentService,
  ) { }

  public generateDataLoader() {
    return new DataLoader<number, number>(keys => this.commentService.findBySubCounts(keys));
  }
}
