import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { PictureInput } from '@graphql/Picture/input';
import { PictureRepository } from '@repositories/PictureRepository';

@Service()
export class PictureService {
  public pictureRepository: PictureRepository = getCustomRepository(PictureRepository);

  public add = this.pictureRepository.add;

  public getList = async () => {
    return await this.pictureRepository.find();
  }
}
