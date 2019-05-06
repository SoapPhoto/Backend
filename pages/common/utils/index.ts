export * from './route';

export function indexOfSmallest(a: number[]): number {
  return a.indexOf(Math.min.apply(Math, a));
}

export const server = typeof window === 'undefined';
