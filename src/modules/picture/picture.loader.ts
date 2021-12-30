import { Injectable, Scope } from '@nestjs/common';
import { NestDataLoader } from '@server/shared/graphql/loader/loader.interceptor';
import DataLoader from 'dataloader';

import { PictureService } from './picture.service';

@Injectable({ scope: Scope.REQUEST })
export class PictureCommentCountLoader
  implements NestDataLoader<number, number>
{
  constructor(private readonly pictureService: PictureService) {}

  public generateDataLoader() {
    return new DataLoader<number, number>((keys) =>
      this.pictureService.findCommentCounts(keys)
    );
  }
}
