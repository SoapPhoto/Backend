import uid from 'uniqid';

export const uniqid = (key?: string) => {
  if (key) {
    return uid(window.btoa(key).replace('==', '-'));
  }
  return uid();
};

export const uniqidTime = () => uid.time();
