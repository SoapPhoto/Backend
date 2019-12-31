import { useCallback, useState } from 'react';
import { useRouter as useBaseRouter } from 'next/router';

import { useRouter } from '@lib/router/useRouter';
import { Histore } from '../utils';

interface IOptions {
  href: string;
}

export const usePushModal = (options: IOptions) => {
  const {
    params, back, pathname,
  } = useRouter();
  const { push, replace } = useBaseRouter();
  const [visible, setVisible] = useState(false);
  const openWithRoute = useCallback((label: string, isPush?: boolean, isReplace?: boolean) => {
    let func = push;
    if (isReplace) func = replace;
    if (isPush) {
      func(options, `${pathname}?modal=${label}`, {
        shallow: true,
      });
      Histore.set('modal', `child-${label}`);
    } else {
      const child = Histore!.get('modal');
      if (/^child/g.test(child)) {
        back();
        Histore.set('modal', `child-${label}-back`);
      } else {
        func(`/views/picture?id=${params.id}`, pathname, {
          shallow: true,
        });
      }
    }
  }, [back, options, params.id, pathname, push, replace]);
  return [visible, setVisible, openWithRoute];
};
