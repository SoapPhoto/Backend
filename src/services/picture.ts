import { Service } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { PictureInput } from '@graphql/Picture/input';
import { PictureRepository } from '@repositories/PictureRepository';

@Service()
export class PictureService {
  public pictureRepository: PictureRepository = getCustomRepository(PictureRepository);

  public getList = async () => {
    return await this.pictureRepository.find();
  }

  public add = async (picture: PictureInput): Promise<PictureInput> => {
    return await this.pictureRepository.save(picture);
  }
}
