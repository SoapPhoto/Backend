import dynamic from 'next/dynamic';
import React from 'react';

import { observer } from 'mobx-react-lite';
import { useStores } from '@lib/stores/hooks';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

export const StateJson = observer(() => {
  const store = useStores();
  return (
    <DynamicReactJson
      src={store}
      theme="rjv-default"
      name="rootStore"
      collapsed={2}
      iconStyle="circle"
      displayDataTypes={false}
      enableClipboard={false}
    />
  );
});
