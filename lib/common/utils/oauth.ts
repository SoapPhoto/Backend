/* eslint-disable @typescript-eslint/camelcase */
import qs from 'querystring';

import { OauthType } from '@common/enum/router';
import { OauthStateType } from '@common/enum/oauthState';
import { isFunction } from 'lodash';

export interface IOauthSuccessData {
  code?: string;
  message?: string;
  type: OauthType;
}

let openWindow: Window | null = null;

export const getOauthUrl = (type: OauthType, state: OauthStateType) => {
  let url = '';
  let query: Record<string, any> = {};
  const cb = `${process.env.API_URL}/oauth/${type.toLowerCase()}/redirect`;
  if (type === OauthType.GITHUB) {
    const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
    url = 'https://github.com/login/oauth/authorize';
    query = {
      state,
      client_id: clientId,
      redirect_uri: cb,
    };
  } else if (type === OauthType.GOOGLE) {
    const clientId = process.env.OAUTH_GOOGLE_CLIENT_ID;
    url = 'https://accounts.google.com/o/oauth2/v2/auth';
    query = {
      state,
      client_id: clientId,
      response_type: 'code',
      scope: 'profile email',
      redirect_uri: cb,
    };
  }
  return `${url}?${qs.stringify(query)}`;
};

export const oauthOpen = (url: string) => {
  const windowArea = {
    width: Math.floor(window.outerWidth * 0.6),
    height: Math.floor(window.outerHeight * 0.5),
    left: 0,
    top: 0,
  };

  if (windowArea.width < 1000) {
    windowArea.width = 600;
  }
  if (windowArea.height < 630) {
    windowArea.height = 550;
  }
  windowArea.left = Math.floor(
    window.screenX + (window.outerWidth - windowArea.width) / 2,
  );
  windowArea.top = Math.floor(
    window.screenY + (window.outerHeight - windowArea.height) / 3,
  );

  if (openWindow) openWindow.close();

  const closeWindow = () => {
    if (openWindow) openWindow.close();
    openWindow = null;
  };

  const sep = url.indexOf('?') !== -1 ? '&' : '?';
  const _url = `${url}${sep}`;
  const windowOpts = `toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0,
    width=${windowArea.width},height=${windowArea.height},
    left=${windowArea.left},top=${windowArea.top}`;

  openWindow = window.open(_url, 'OauthNewWindow', windowOpts);
  // 循环小窗口url，判断是否回调成功，获取回调参数
  const scanTimer = setInterval(() => {
    try {
      // 非同域名会报错，所以要先去请求一下，然后关闭窗口
      // eslint-disable-next-line no-unused-expressions
      console.log(openWindow && openWindow.location);
    } catch (err) {
      // clearInterval(scanTimer);
      // setTimeout(() => closeWindow(), 1000);
      return;
    }
    if (openWindow && openWindow.closed) {
      clearInterval(scanTimer);
      openWindow = null;
    }
    if (
      openWindow
      && openWindow.location.origin === window.location.origin
      && /^\/redirect\/oauth/.test(openWindow.location.pathname)
    ) {
      clearInterval(scanTimer);
    }
    window.postMessage(
      { fromOauthWindow: openWindow!.location.search },
      window.location.href,
    );
  }, 1000);
  window.addEventListener('message', (msg) => {
    if (
      /* eslint-disable */
      !~msg.origin.indexOf(
        `${window.location.protocol}//${window.location.host}`
      )
      /* eslint-enable */
    ) {
      clearInterval(scanTimer);
      closeWindow();
    }
    if (msg.data.fromParent) {
      clearInterval(scanTimer);
      closeWindow();
    }
  });
};

export const oauthSuccess = (e: MessageEvent, cb: (data: IOauthSuccessData) => void, ok?: () => void) => {
  if (e.origin === window.location.origin) {
    if (e.data && e.data.fromOauthWindow) {
      const data = (qs.parse(e.data.fromOauthWindow.substr(1)) as any) as IOauthSuccessData;
      if (data.code && !data.message) {
        cb(data);
        window.postMessage({ fromParent: true }, window.location.href);
        if (isFunction(ok)) ok();
      } else {
        setTimeout(() => window.postMessage({ fromParent: true }, window.location.href), 1000);
      }
    }
  }
};
