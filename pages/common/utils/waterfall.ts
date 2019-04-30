import { indexOfSmallest } from '.';
import { PictureEntity } from '../interfaces/picture';

export const listParse = (list: PictureEntity[], number: number) => {
  const newList = [...Array(number)].map<PictureEntity[]>(_ => []);
  const colHeight = [...Array(number)].map<number>(_ => 0);
  for (const picture of list) {
    const minIndex = indexOfSmallest(colHeight);
    newList[minIndex].push(picture);
    colHeight[minIndex] += picture.height;
  }
  return newList;
};
