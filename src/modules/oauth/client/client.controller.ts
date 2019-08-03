import {
  Controller, Post, Query, UseFilters, UseGuards,
} from '@nestjs/common';

import { Roles } from '@server/common/decorator/roles.decorator';
import { User } from '@server/common/decorator/user.decorator';
import { AllExceptionFilter } from '@server/common/filter/exception.filter';
import { AuthGuard } from '@server/common/guard/auth.guard';
import { Role } from '@server/modules/user/enum/role.enum';
import { UserEntity } from '@server/modules/user/user.entity';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/client.dto';

@Controller('api/client')
@UseGuards(AuthGuard)
@UseFilters(new AllExceptionFilter())
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post('add')
  @Roles(Role.USER)
  public async addClient(
    @User() user: UserEntity,
    @Query() param: CreateClientDto,
  ) {
    const data = await this.clientService.create(param);
    return data;
  }
}
