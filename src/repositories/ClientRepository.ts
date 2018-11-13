import { Client } from '@entities/Client';
import { DeepPartial, EntityRepository, Repository, SaveOptions, UpdateResult } from 'typeorm';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {
  public async add<T extends DeepPartial<Client>>(client: T) {
    const test = await this.save(client);
    console.log(this.metadata);
    return test;
    // await this.afterLoad();
  }
}
