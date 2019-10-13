import React, { useEffect } from 'react';

import { StateTreeModal } from '@lib/components/StateTreeModal';
import Head from 'next/head';
import { Header } from '../Header';
import { Wapper } from './styles';

interface IProps {
  header: boolean;
}

export const BodyLayout: React.FC<IProps> = ({ children, header = true }) => {
  const [treeVisible, setTreeVisible] = React.useState(false);
  useEffect(() => {
    const func = (e: KeyboardEvent) => {
      if (e.keyCode === 81 && e.ctrlKey && process.env.NODE_ENV !== 'production') {
        setTreeVisible(true);
      }
    };
    document.addEventListener('keydown', func);
    return () => {
      document.removeEventListener('keydown', func);
    };
  }, []);
  // keydown(Keys.ENTER)((props: any) => {
  //   console.log(props);
  // });
  return (
    <Wapper>
      <Head>
        {/* eslint-disable-next-line max-len */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0,user-scalable=no" />
      </Head>
      {
        header
          ? <Header />
          : <div />
      }
      {children}
      <StateTreeModal
        visible={treeVisible}
        onClose={() => setTreeVisible(false)}
      />
    </Wapper>
  );
};
