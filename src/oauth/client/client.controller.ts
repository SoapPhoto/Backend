import { Controller, Post, Query } from '@nestjs/common';

import { ClientService } from './client.service';
import { CreateClientDto } from './dto/client.dto';

@Controller('client')
export class ClientController {

  constructor(
    private readonly clientService: ClientService,
  ) {}

  @Post('add')
  public async addClient(
    @Query() param: CreateClientDto,
  ) {
    const data = await this.clientService.create(param);
    return data;
  }
}
