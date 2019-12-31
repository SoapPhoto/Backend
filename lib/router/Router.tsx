import React from 'react';
import { NextRouter, withRouter } from 'next/router';

import { parsePath, Histore } from '@lib/common/utils';
import { Router as BaseRouter } from '@lib/routes';
import { store } from '@lib/stores/init';
import { RouterAction } from '@lib/stores/AppStore';
import { RouterContext, IRouter, RouterPush } from '.';

const hybridRouter = (route: NextRouter): IRouter => {
  const data = parsePath(route.asPath);
  // eslint-disable-next-line max-len
  const func: (fu: RouterPush, action: RouterAction) => RouterPush = (fu, action) => async (routes, params, options) => {
    store.appStore.setRoute({
      as: route.route,
      options,
      href: data.href,
      action,
    });
    const re = fu(routes, params, options);
    if (options && options.state && Histore) {
      Object.keys(options.state).forEach(key => (
        Histore!.set(key, options.state[key])
      ));
    } else {
      Histore!.set('modal', undefined);
    }
    return re;
  };
  return {
    ...data,
    pushRoute: func(BaseRouter.pushRoute, RouterAction.PUSH),
    replaceRoute: func(BaseRouter.replaceRoute, RouterAction.REPLACE),
    back: () => {
      store.appStore.setRoute({
        as: route.route,
        href: data.href,
        action: RouterAction.POP,
      });
      BaseRouter.back();
    },
  };
};

export const Router = withRouter(({
  children,
  router,
}) => <RouterContext.Provider value={hybridRouter(router)}>{children}</RouterContext.Provider>);
