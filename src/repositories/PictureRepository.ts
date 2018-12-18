import { Picture, PictureInfo } from '@entities/Picture';
import { EntityRepository, Repository } from 'typeorm';

export interface IPictureInput {
  hash: string;
  key: string;
  user: any;
  info: PictureInfo;
}

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
  public getList = async () => {
    return await this.find();
  }

  public add = async (input: IPictureInput): Promise<Partial<Picture>> => {
    const picture = new Picture();
    picture.hash = input.hash;
    picture.key = input.key;
    picture.user = input.user;
    picture.info = input.info;
    return this.save(picture);
  }
}
