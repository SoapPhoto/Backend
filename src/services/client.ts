import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { Client } from '@entities/Client';
import { ClientRepository } from '@repositories/ClientRepository';

@Service()
export class ClientService {
  public clientRepository: ClientRepository = getCustomRepository(ClientRepository);

  public add = async (client: Partial<Client>): Promise<Partial<Client>> => {
    return await this.clientRepository.add(client);
  }
}
