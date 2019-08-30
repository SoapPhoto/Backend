import React from 'react';

import ReactDOM from 'react-dom';

import { ToastComponent } from './Toast';

class Toast {
  public ref!: ToastComponent;

  constructor() {
    if (!(typeof window === 'undefined')) {
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

  public base = (title: string, duration?: number) => {
    this.ref.add({
      title,
      duration,
      type: 'base',
    });
  }

  public success = (title: string, duration?: number) => {
    this.ref.add({
      title,
      duration,
      type: 'success',
    });
  }

  public warning = (title: string, duration?: number) => {
    this.ref.add({
      title,
      duration,
      type: 'warning',
    });
  }

  public error = (title: string, duration?: number) => {
    this.ref.add({
      title,
      duration,
      type: 'error',
    });
  }
}

export default new Toast();
