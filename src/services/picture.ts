import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { PictureListArgs } from '@graphql/Picture/input';
import { PictureRepository } from '@repositories/PictureRepository';
import { UserInputError } from 'apollo-server';

@Service()
export class PictureService {
  public pictureRepository: PictureRepository = getCustomRepository(PictureRepository);

  public add = this.pictureRepository.add;

  public getList = async ({ userId, picture, last, first }: PictureListArgs) => {
    const query = this.pictureRepository.createQueryBuilder('picture')
      .leftJoinAndSelect('picture.user', 'user');
    if (userId) {
      query.where('picture.user=:userId', { userId });
    }
    if (picture) {
      let limit = 10;
      if (last || first) {
        limit = last || first;
      }
      query.where('picture.id=:picture', { picture })
        .orderBy('picture.createdAt', 'ASC')
        .take(limit);
    }
    return await query.getMany();
  }

  public getOne = async (id: string) => {
    const data = await this.pictureRepository.createQueryBuilder('picture')
      .where('picture.id=:id', { id })
      .leftJoinAndSelect('picture.user', 'user')
      .getOne();
    return data;
  }
}
