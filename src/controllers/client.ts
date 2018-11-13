import { JsonController, Post } from 'routing-controllers';
import { Inject } from 'typedi';

import { Client } from '@entities/Client';
import { ClientService } from '@services/client';

@JsonController('/client')
export class PostController {
  @Inject()
  public clientService: ClientService;

  @Post('/')
	public getAll(): Promise<Partial<Client>> {
    return this.clientService.add({
      clientId: 'test',
      clientSecret: 'abc',
      clientName: 'soap',
      grants: [''],
    });
  }
}
