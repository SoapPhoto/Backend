import { IPathInfo } from '@lib/common/utils';
import { RouteParams } from 'next-routes';

export type RouterPush = (
  route: string,
  params?: RouteParams,
  options?: Record<string, any>,
) => Promise<boolean>;

export interface IRouter extends IPathInfo {
  pushRoute: RouterPush;
  replaceRoute: RouterPush;
  back(): void;
}
