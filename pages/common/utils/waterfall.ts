import { PictureClass } from '@pages/stores/class/Picture';
import { indexOfSmallest } from '.';
import { PictureEntity } from '../interfaces/picture';

export const listParse = <T extends {height: number}>(list: T[], number: number) => {
  const newList = [...Array(number)].map<T[]>(_ => []);
  const colHeight = [...Array(number)].map<number>(_ => 0);
  for (const picture of list) {
    const minIndex = indexOfSmallest(colHeight);
    newList[minIndex].push(picture);
    colHeight[minIndex] += picture.height;
  }
  return newList;
};
