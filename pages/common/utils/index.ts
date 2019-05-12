export * from './route';

export function indexOfSmallest(a: number[]): number {
  return a.indexOf(Math.min.apply(Math, a));
}
/**
 * 获取窗口滚动条
 *
 * @returns
 */
export function getScrollWidth() {
  const div = document.createElement('DIV');
  let noScroll;
  let scroll;
  div.style.cssText = 'position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;';
  noScroll = document.body.appendChild(div).clientWidth;
  div.style.overflowY = 'scroll';
  scroll = div.clientWidth;
  document.body.removeChild(div);
  return noScroll - scroll;
}

export function setBodyCss(css: Partial<CSSStyleDeclaration>) {
  const body = document.querySelector('body')!;
  const init = body.getAttribute('style')!;
  for (const key in css) {
    if (key) {
      body.style[key] = css[key] as string;
    }
  }
  return () => {
    body.setAttribute('style', init || '');
  };
}

export const server = typeof window === 'undefined';
