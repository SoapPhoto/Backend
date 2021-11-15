import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InviteEntity } from './invite.entity';
import { InviteResolver } from './invite.resolvers';
import { InviteService } from './invite.service';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [
    TypeOrmModule.forFeature([InviteEntity]),
  ],
  controllers: [],
  providers: [InviteService, InviteResolver],
})
export class InviteModule {}
