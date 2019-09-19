/* eslint-disable @typescript-eslint/interface-name-prefix */
import 'react';
// import('styled-components').CSSProp<import('styled-components').DefaultTheme>
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    css?: any;
  }
}
