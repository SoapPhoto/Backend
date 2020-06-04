import { resolve } from 'path';

import { config } from 'dotenv';

config({
  path: process.env.NODE_ENV === 'production' ? resolve(process.cwd(), '.env.production') : undefined,
});
