import React from 'react';
import { Router as RouterProps } from 'next/router';

import { parsePath, histore, Histore } from '@lib/common/utils';
import { Router as BaseRouter } from '@lib/routes';
import { store } from '@lib/stores/init';
import { RouterAction } from '@lib/stores/AppStore';
import { RouterContext, IRouter, RouterPush } from '.';

interface IProps {
  route: RouterProps;
}

const hybridRouter = (route: RouterProps): IRouter => {
  const data = parsePath(route.asPath);
  const func: (fu: RouterPush, action: RouterAction) => RouterPush = (fu, action) => (routes, params, options) => {
    store.appStore.setRoute({
      as: route.route,
      options,
      href: data.href,
      action,
    });
    if (options && options.state && Histore) {
      Histore!.set(options.state);
    }
    return fu(routes, params, options);
  };
  return {
    ...data,
    pushRoute: func(BaseRouter.pushRoute, RouterAction.PUSH),
    replaceRoute: func(BaseRouter.replaceRoute, RouterAction.REPLACE),
    back: BaseRouter.back,
  };
};

export const Router: React.FC<IProps> = ({
  children,
  route,
}) => <RouterContext.Provider value={hybridRouter(route)}>{children}</RouterContext.Provider>;
