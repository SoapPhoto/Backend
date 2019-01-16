import { Signale } from 'signale';

export const logger = new Signale({
  config: {
    displayFilename: true,
    displayTimestamp: true,
  },
});
