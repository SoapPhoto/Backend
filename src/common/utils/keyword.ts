import nodejieba from 'nodejieba';

export function keyword(info: (string | undefined)[]): string[] {
  const tags: Set<string> = new Set();
  info.forEach((item) => {
    if (!item) return;
    nodejieba.tag(item).forEach((tag: any) => {
      if (tag.word === ' ' || tag.word === '') return;
      if (tag.tag === 'uj' || tag.tag === 'uj') return;
      tags.add(tag.word);
    });
    nodejieba.extract(item, 20).forEach((tag: any) => {
      tags.add(tag.word);
    });
  });
  return [...tags];
}
