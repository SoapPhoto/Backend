import * as crypto from 'crypto';
import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { IUser } from '@controllers/account';
import { User } from '@entities/User';
import { UserInput } from '@graphql/User/input';
import { UserRepository } from '@repositories/UserRepository';
import { ApiError } from '@utils/ApiError';
import { ROLES } from '@utils/constants';

@Service()
export class UserService {
  public userRepository: UserRepository = getCustomRepository(UserRepository);

  public add = async (user: IUser): Promise<Partial<User>> => {
    const userByName  = await this.userRepository.findOne({ username: user.username });
    if (userByName) {
      throw new ApiError(400, 'register_duplicate_username');
    }
    const userByEmail  = await this.userRepository.findOne({ email: user.email });
    if (userByName) {
      throw new ApiError(400, 'register_duplicate_email');
    }
    const newUser = new User();
    newUser.email = user.email;
    newUser.roles = [ROLES.USER];
    newUser.username = user.username;
    const salt = await crypto.randomBytes(32).toString('hex');
    const hash = await crypto.pbkdf2Sync(user.password, salt, 20, 32, 'sha512').toString('hex');
    newUser.salt = salt;
    newUser.hash = hash;

    return await this.userRepository.save(newUser);
  }
  public getOne = async (username: string) => {
    return await this.userRepository.createQueryBuilder('user')
    .where('user.username=:username', { username })
    .getOne();
  }
  public update = async (id: number, input: UserInput) => {
    const user = await this.userRepository.findOne({
      id,
    });
    console.log(user);
    // await this.userRepository.createQueryBuilder()
    //   .update(User)
    //   .set(input)
    //   .where('id=:id', { id })
    //   .execute();
  }
}
