import { IObservableArray, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';
import uniqid from 'uniqid';

type ToastType = 'success' | 'warning' | 'danger' | 'base';

interface IToastConfig  {
  key?: string | number;
  duration?: number;
  title: string;
  type?: ToastType;
}

const height = 72;

const form = [
  'translate3d(0px, 72px, -1px)',
  'translate3d(0, 0, 0) scale(1)',
  'translate3d(0, -14px, 0) scale(0.95)',
  'translate3d(0, -14px, 0) scale(0.95)',
];
const to = [
  'translate3d(0, 0, 0)',
  'translate3d(0, -14px, 0) scale(.95)',
  'translate3d(0, -28px, 0) scale(0.9)',
  'translate3d(0, -28px, 0) scale(0.9)',
];

const animate: {
  [key in TransitionStatus]: string[]
} = {
  entering: form,
  entered: to,
  exiting: form,
  exited: form,
  unmounted: [],
};

const hover = [
  'translate3d(0, 0, 0)',
  `translate3d(0, -${height}px, 0) scale(1)`,
  `translate3d(0, -${height * 2}px, 0) scale(1)`,
  `translate3d(0, -${height * 3}px, 0) scale(1)`,
];

const Area = styled.div`
  position: fixed;
  bottom: 10px;
  right: 20px;
  max-width: 420px;
  z-index: 2000;
  transition: transform 0.4s, opacity 0.4s ease;
  &:hover {
    div:nth-last-child(1) {
      transform: ${hover[0]} !important;
    }
    div:nth-last-child(2) {
      transform: ${hover[1]} !important;
    }
    div:nth-last-child(3) {
      transform: ${hover[2]} !important;
    }
    div:nth-last-child(4) {
      transform: ${hover[3]} !important;
    }
  }
  div:nth-last-child(n + 4) {
    visibility: hidden;
  }
`;

const Container = styled.div`
  transform: translate3d(0, -0, -0) scale(1);
  transition: all 0.4s ease;
  position: absolute;
  bottom: 0;
  height: ${height}px;
  right: 0;
`;

const ToastBox = styled.div`
  padding: 0 20px;
  border-radius: 5px;
  border: 0;
  width: 420px;
  height: 60px;
  color: black;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  transition: transform 0.4s, opacity 0.4s ease;
`;

@observer
export class ToastComponent extends React.Component {
  @observable public configList: IObservableArray<IToastConfig> = ([] as any);
  public state = {
    arr: [],
  };
  public add = (config: IToastConfig) => {
    const newConfig = {
      ...config,
      key: uniqid(),
    };
    const index = this.configList.push(newConfig);
    // if (config.duration !== 0) {
    //   setTimeout(() => {
    //     const data = this.configList.find(item => item.key === newConfig.key);
    //     if (data) this.configList.remove(data);

    //   },         config.duration || 5000);
    // }
  }
  public render() {
    return (
      <TransitionGroup component={Area}>
        {this.configList.map((value, key) => (
          <Transition key={value.key} appear timeout={10}>
            {state => (
              <Container
                style={{
                  // transform: animate[state][this.configList.length - key - 1],
                  transform: animate[state][this.configList.length - key - 1],
                }}
              >
                <ToastBox>{value.title}</ToastBox>
              </Container>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}
