import { useContext } from 'react';

import { RouterContext } from './RouterContext';

export const useRouter = () => {
  const data = useContext(RouterContext);

  return data;
};
