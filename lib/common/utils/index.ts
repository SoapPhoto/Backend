import { TFunction } from '@lib/i18n/interface';
import { enableBodyScroll, disableBodyScroll, BodyScrollOptions } from 'body-scroll-lock';

export * from './route';
export * from './math';

export function indexOfSmallest(a: number[]): number {
  // eslint-disable-next-line prefer-spread
  return a.indexOf(Math.min.apply(Math, a));
}
/**
 * 获取窗口滚动条
 *
 * @returns
 */
export function getScrollWidth() {
  const div = document.createElement('DIV');
  div.style.cssText = 'position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;';
  const noScroll = document.body.appendChild(div).clientWidth;
  div.style.overflowY = 'scroll';
  const scroll = div.clientWidth;
  document.body.removeChild(div);
  return noScroll - scroll;
}

/**
 * 设置 body 上的 style
 *
 * @export
 * @param {Partial<CSSStyleDeclaration>} css
 * @returns
 */
export function setBodyCss(css: Partial<CSSStyleDeclaration>) {
  const body = document.querySelector('body')!;
  const init = body.getAttribute('style')!;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in css) {
    if (key) {
      body.style[key] = css[key] as string;
    }
  }
  return () => {
    body.setAttribute('style', init || '');
  };
}

export const server = !!(typeof window === 'undefined');

export function getScrollTop() {
  let scrollTop = 0;
  let bodyScrollTop = 0;
  let documentScrollTop = 0;
  if (document.body) {
    bodyScrollTop = document.body.scrollTop;
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop;
  }
  scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
  return scrollTop;
}
export function getScrollHeight() {
  let scrollHeight = 0;
  let bodyScrollHeight = 0;
  let documentScrollHeight = 0;
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight;
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight;
  }
  scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
  return scrollHeight;
}

export function getWindowHeight() {
  let windowHeight = 0;
  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight;
  } else {
    windowHeight = document.body.clientHeight;
  }
  return windowHeight;
}

export const ua = server ? '' : window.navigator.userAgent;

export const isSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Version') !== -1;

export const getTitle = (title: string, t?: TFunction) => (
  `${t ? t(title) : title} - ${t ? t('title.name') : process.env.TITLE}`
);


export const defaultScrollOptions: BodyScrollOptions = {
  reserveScrollBarGap: true,
};

export const enableScroll = () => {
  if (server) return;
  enableBodyScroll(document.querySelector('body')!);
  enableBodyScroll(document.querySelector('html')!);
};

export const disableScroll = () => {
  if (server) return;
  disableBodyScroll(document.querySelector('body')!, defaultScrollOptions);
  disableBodyScroll(document.querySelector('html')!, defaultScrollOptions);
};

export function isIn(target: Node, parent: Element) {
  const path: Node[] = [];
  let parentNode: Node | null = target;
  while (parentNode && parentNode !== document.body) {
    path.push(parentNode);
    // eslint-disable-next-line prefer-destructuring
    parentNode = parentNode.parentNode;
  }
  return path.indexOf(parent) !== -1;
}
