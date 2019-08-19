import { IObservableArray, observable } from 'mobx';
import { observer } from 'mobx-react';
import { rem, timingFunctions } from 'polished';
import React from 'react';
import { Transition, TransitionGroup } from 'react-transition-group';
import { TransitionStatus } from 'react-transition-group/Transition';
import styled from 'styled-components';
import uniqid from 'uniqid';

type ToastType = 'success' | 'warning' | 'error' | 'base';

interface IToastConfig {
  key?: string | number;
  duration?: number;
  title: string;
  type?: ToastType;
}

const height = 72;

const style: Record<ToastType, string> = {
  success: '#007aff',
  error: '#eb5757',
  warning: '#f5a623',
  base: '#fff',
};

const styleColor: Record<ToastType, string> = {
  success: '#fff',
  error: '#fff',
  warning: '#fff',
  base: '#000',
};

/// TODO: safari 用 translate3d 图层会闪一下

const form = [
  {
    marginBottom: '-100px',
    // transform: 'translate3d(0px, 100px, -1px)',
    opacity: 0,
  },
  {
    marginBottom: '0px',
    transform: 'scale(1)',
    // transform: 'translate3d(0, 0, 0) scale(1)',
    opacity: 0,
  },
  {
    marginBottom: '14px',
    transform: 'scale(.95)',
    // transform: 'translate3d(0, -14px, 0) scale(0.95)',
    opacity: 0,
  },
  {
    marginBottom: '14px',
    transform: 'scale(.95)',
    // transform: 'translate3d(0, -14px, 0) scale(0.95)',
    opacity: 0,
  },
];
const to = [
  {
    marginBottom: '0',
    // transform: 'translate3d(0, 0, 0)',
    opacity: 1,
  },
  {
    marginBottom: '14px',
    transform: 'scale(.95)',
    // transform: 'translate3d(0, -14px, 0) scale(.95)',
    filter: 'blur(.6px)',
    opacity: 1,
  },
  {
    marginBottom: '28px',
    transform: 'scale(.9)',
    // transform: 'translate3d(0, -28px, 0) scale(0.9)',
    filter: 'blur(.8px)',
    opacity: 1,
  },
  {
    marginBottom: '28px',
    transform: 'scale(.8)',
    // transform: 'translate3d(0, -28px, 0) scale(0.9)',
    filter: 'blur(1px)',
    opacity: 1,
  },
];

const animate: {
  [key in TransitionStatus]: React.CSSProperties[]
} = {
  entering: form,
  entered: to,
  exiting: form,
  exited: to,
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
  bottom: ${rem('10px')};
  right: ${rem('20px')};
  max-width: ${rem('420px')};
  z-index: 2000;
  transition-timing-function: ${timingFunctions('easeInOutSine')};
  transition: transform 0.4s, opacity 0.4s;
  &:hover {
    div {
      filter: blur(0px) !important;
    }
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
  transition-timing-function: ${timingFunctions('easeInOutSine')};
  transition: all 0.4s;
  position: absolute;
  bottom: 0;
  height: ${rem(height)};
  right: 0;
`;

const ToastBox = styled.div<{type?: ToastType}>`
  padding: 0 ${rem('20px')};
  border-radius: ${rem('5px')};
  border: 0;
  width: ${rem('420px')};
  height: ${rem('60px')};
  color: ${_ => styleColor[_.type || 'base']};
  background-color: ${_ => style[_.type || 'base']};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 ${rem('4px')} ${rem('9px')} rgba(0, 0, 0, 0.12);
  font-size: ${() => rem(14)};
  transition-timing-function: ${timingFunctions('easeInOutSine')};
  transition: transform 0.4s, opacity 0.4s;
`;

@observer
export class ToastComponent extends React.Component {
  @observable public configList: IObservableArray<IToastConfig> = observable.array([]);

  public add = (config: IToastConfig) => {
    const newConfig = {
      ...config,
      key: uniqid(),
    };
    this.configList.push(newConfig);
    if (config.duration !== 0) {
      setTimeout(() => {
        const data = this.configList.find(item => item.key === newConfig.key);
        if (data) this.configList.remove(data);
      }, config.duration || 6000);
    }
  }

  public animate = (state: TransitionStatus, key: number) => {
    if (state === 'exiting') {
      return animate[state][key];
    }
    return animate[state][this.configList.length - key - 1];
  }

  public render() {
    return (
      <TransitionGroup component={Area}>
        {this.configList.map((value, key) => (
          <Transition
            key={value.key}
            appear
            timeout={{
              enter: 0,
              exit: 400,
            }}
          >
            {state => (
              <Container
                style={{
                  ...this.animate(state, key),
                  zIndex: 1000 + key,
                }}
              >
                <ToastBox type={value.type}>{value.title}</ToastBox>
              </Container>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }
}
