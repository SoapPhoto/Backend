import { Module } from '@nestjs/common';

import { PictureModule } from '@server/picture/picture.module';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
  imports: [PictureModule],
  controllers: [ViewsController],
  providers: [ViewsService],
})
export class ViewsModule {}
