import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientEntity } from './client.entity';
import { ClientService } from './client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity]),
  ],
  providers: [
    ClientService,
  ],
  exports: [
    ClientService,
  ],
})
export class ClientModule {}
