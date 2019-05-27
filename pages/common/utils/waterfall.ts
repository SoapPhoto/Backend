import { indexOfSmallest } from '.';

export const listParse = <T extends {height: number; width: number; }>(list: T[], number: number) => {
  const newList = [...Array(number)].map<T[]>(_ => []);
  const colHeight = [...Array(number)].map<number>(_ => 0);
  for (const picture of list) {
    const minIndex = indexOfSmallest(colHeight);
    newList[minIndex].push(picture);
    colHeight[minIndex] += (1 - (picture.width - picture.height) / picture.width) * 100;
  }
  return newList;
};
