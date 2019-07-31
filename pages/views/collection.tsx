import React from 'react';
import { withError } from '@lib/components/withError';
import Head from 'next/Head';
import { getTitle } from '@lib/common/utils';

const Collection: React.FC = () => (
  <div>
    <Head>
      <title>{getTitle('# adfasdf')}</title>
    </Head>
    123123
  </div>
);

export default withError(Collection);
