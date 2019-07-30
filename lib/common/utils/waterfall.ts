import { indexOfSmallest } from '.';

// eslint-disable-next-line arrow-parens
export const listParse = <T extends {height: number; width: number }>(list: T[], number: number) => {
  const newList = [...Array(number)].map<T[]>(() => []);
  const colHeight = [...Array(number)].map<number>(() => 0);
  // eslint-disable-next-line no-restricted-syntax
  for (const picture of list) {
    const minIndex = indexOfSmallest(colHeight);
    newList[minIndex].push(picture);
    colHeight[minIndex] += (1 - (picture.width - picture.height) / picture.width) * 100;
  }
  return newList;
};
