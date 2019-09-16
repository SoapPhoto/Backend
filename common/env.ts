import { resolve } from 'path';

import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'production' ? resolve(__dirname, '../.env.production') : undefined,
});
