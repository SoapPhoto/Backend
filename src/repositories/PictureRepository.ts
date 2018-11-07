import { Picture } from '@entities/Picture';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Picture)
export class PictureRepository extends Repository<Picture> {
  public getList = async () => {
    return await this.find();
  }
}
