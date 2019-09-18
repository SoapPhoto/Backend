import 'react';
// Add support for css prop
declare module 'react' {
  interface Attributes {
    css?: any;
  }
  interface DOMAttributes<T> {
    css?: any;
  }
}
