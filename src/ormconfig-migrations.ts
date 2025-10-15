import { resolve } from 'path';

import { config as dotenvConfig } from 'dotenv';

dotenvConfig({
  path:
    process.env.NODE_ENV === 'production'
      ? resolve(process.cwd(), '.env.production')
      : undefined,
});

import { DataSource } from 'typeorm';
import config from './ormconfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default new DataSource(config as any);
