import { Picture } from '@entities/Picture';
import { EntityRepository, Repository } from 'typeorm';

export interface IPictureInput {
  hash: string;
  user: any;
}

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
  public getList = async () => {
    return await this.find();
  }

  public add = async (input: IPictureInput): Promise<Partial<Picture>> => {
    const picture = new Picture();
    picture.hash = input.hash;
    picture.user = input.user;
    return this.save(picture);
  }
}
