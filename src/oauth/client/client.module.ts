import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientController } from './client.controller';
import { ClientEntity } from './client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  providers: [
    ClientService,
  ],
  controllers: [ClientController],
  exports: [
    ClientService,
  ],
})
export class ClientModule {}
