import dynamic from 'next/dynamic';
import React from 'react';

import { store } from '@lib/stores/init';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });

export const StateJson = () => (
  <DynamicReactJson
    src={JSON.parse(JSON.stringify(store))}
    theme="rjv-default"
    name="rootStore"
    collapsed={2}
    iconStyle="circle"
    displayDataTypes={false}
    enableClipboard={false}
  />
);
