import React, { useEffect } from 'react';

import { StateTreeModal } from '@lib/components/StateTreeModal';
import Head from 'next/head';
import { Header } from '../Header';
import { Wrapper } from './styles';
import { Footer } from '../Footer';

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
    <Wrapper>
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
      {
        header
          ? <Footer />
          : <div />
      }
      <StateTreeModal
        visible={treeVisible}
        onClose={() => setTreeVisible(false)}
      />
    </Wrapper>
  );
};
