import { Controller, Post, Query, UseGuards } from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { UserEntity } from '@server/user/user.entity';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/client.dto';

@Controller('api/client')
@UseGuards(AuthGuard)
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
