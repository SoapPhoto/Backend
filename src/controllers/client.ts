import { Authorized, JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';

import { Client } from '@entities/Client';
import { ClientService } from '@services/client';
import { ROLES } from '@utils/constants';

@JsonController('/client')
export class PostController {
  @Inject()
  public clientService: ClientService;

  @Authorized(ROLES.ADMIN)
  @Post('/')
	public getAll(): Promise<Partial<Client>> {
    return this.clientService.add({
      clientId: 'test',
      clientSecret: 'abc',
      clientName: 'soap',
      grants: ['password', 'refresh_token'],
    });
  }
}
