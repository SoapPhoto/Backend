import React from 'react';

import { StateTreeModal } from '@lib/components/StateTreeModal';
import { Header } from '../Header';
import { Wapper } from './styles';

interface IProps {
  header: boolean;
}

export const BodyLayout: React.FC<IProps> = ({ children, header = true }) => {
  const [treeVisible, setTreeVisible] = React.useState(false);
  // useEffect(() => {
  //   const func = (e: KeyboardEvent) => {
  //     if (e.code === 'KeyD') {
  //       setTreeVisible(true);
  //     }
  //   };
  //   document.addEventListener('keydown', func);
  //   return () => {
  //     document.removeEventListener('keydown', func);
  //   };
  // }, []);
  // keydown(Keys.ENTER)((props: any) => {
  //   console.log(props);
  // });
  return (
    <Wapper>
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
