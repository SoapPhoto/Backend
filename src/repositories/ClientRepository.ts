import { Client } from '@entities/Client';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {
  public getList = async () => {
    return await this.find();
  }
}
