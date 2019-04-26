import { Controller, Post, Query, UseGuards } from '@nestjs/common';

import { Roles } from '@/common/decorator/roles.decorator';
import { User } from '@/common/decorator/user.decorator';
import { UserEntity } from '@/user/user.entity';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/client.dto';

@Controller('client')
export class ClientController {

  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post('add')
  @Roles('user')
  public async addClient(
    @User() user: UserEntity,
    @Query() param: CreateClientDto,
  ) {
    const data = await this.clientService.create(param);
    return data;
  }
}
