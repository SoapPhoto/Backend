import { User } from '@entities/User';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // public async add<T extends DeepPartial<User>>(client: T) {
  //   const test = await this.save(client);
  //   return test;
  //   // await this.afterLoad();
  // }
}
