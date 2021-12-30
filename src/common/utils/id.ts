import { customAlphabet } from 'nanoid';

export const inviteCode = customAlphabet(
  '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  6
);
