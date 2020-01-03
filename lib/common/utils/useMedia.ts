import { useState } from 'react';
import { server } from '.';
import { useEnhancedEffect } from '../hooks/useEnhancedEffect';

export default function useMedia(queries: string[], values: any[], defaultValue: any) {
  let mediaQueryLists: MediaQueryList[] = [];
  if (!server) {
    mediaQueryLists = queries.map(q => window.matchMedia(q));
  }

  const getValue = () => {
    const index = mediaQueryLists.findIndex(mql => mql.matches);
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue;
  };

  const [value, setValue] = useState(getValue);

  useEnhancedEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach(mql => mql.addListener(handler));
      return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return value;
}
