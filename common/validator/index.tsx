import { Validator } from 'class-validator';

export const validator = new Validator();

export const isUserName = (number: string) => {
  const reg = /^(?=.*[A-z]|[\d]*_+[\d]*)[\w_]{2,15}$/;
  return reg.test(number);
};
