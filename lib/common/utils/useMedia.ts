import { useEffect, useState } from 'react';
import { server } from '.';

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

  useEffect(
    () => {
      const handler = () => setValue(getValue);
      mediaQueryLists.forEach(mql => mql.addListener(handler));
      return () => mediaQueryLists.forEach(mql => mql.removeListener(handler));
    },
    [],
  );

  return value;
}
