import { User } from '@entities/User';
import { DeepPartial, EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async updateUser(id: string, input: Partial<User>): Promise<Partial<User>> {
    const user = await this.findOne(id);
    return await this.save(this.merge(user, input));
  }
}
