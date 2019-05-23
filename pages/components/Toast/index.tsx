import React from 'react';

import ReactDOM from 'react-dom';

import { server } from '@pages/common/utils';
import { Maybe } from '@typings/index';
import { ToastComponent } from './Toast';

class Toast {
  public ref!: ToastComponent;
  constructor() {
    if (!server) {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const refFunc = (ref: Maybe<ToastComponent>) => {
        if (ref) {
          this.ref = ref;
        }
      };
      ReactDOM.render(<ToastComponent ref={refFunc} />, div);
    }
  }
  public base = (title: string) => {
    this.ref.add({
      title,
      type: 'base',
    });
  }
  public success = (title: string) => {
    this.ref.add({
      title,
      type: 'success',
    });
  }
  public warning = (title: string) => {
    this.ref.add({
      title,
      type: 'warning',
    });
  }
  public danger = (title: string) => {
    this.ref.add({
      title,
      type: 'danger',
    });
  }
}

export default new Toast();
