import { Module } from '@nestjs/common';
import { PictureMarkService } from './mark.service';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [],
  controllers: [],
  providers: [PictureMarkService],
})
export class PictureMarkModule {}
