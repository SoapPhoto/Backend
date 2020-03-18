import React, { useState, useEffect, useCallback } from 'react';

import { Histore } from '@lib/common/utils';
import { useRouter } from '@lib/router';

interface IProps {
  action: string;
  back: () => void;
  children: (visible: boolean, close: () => void) => React.ReactElement | null;
}

export const WithQueryParam: React.FC<IProps> = ({ children, action }) => {
  const { query, back } = useRouter();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!query.action || query.action !== action) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [action, query.action]);
  const close = useCallback(() => {
    const child = Histore!.get('modal');
    if (/^child/g.test(child)) {
      back();
      Histore.set('modal', `child-${action}-back`);
    } else {
      back();
    }
  }, [action, back]);
  return children(visible, close);
};
