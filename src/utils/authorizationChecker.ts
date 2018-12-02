import { Action } from 'routing-controllers';

export default async (action: Action, roles: string[]): Promise<boolean> => {
  try {
    const oauth = await import('../oauth');
    await oauth.default.authenticate(action.request, action.response, roles);
    return true;
  } catch (_) {
    return false;
  }
};
