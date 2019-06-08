import 'styled-components';

declare module 'styled-components' {
  // tslint:disable-next-line:interface-name
  export interface DefaultTheme {
    fontSizes: number[];
    lineHeights: {[key: string]: number};
    colors: {
      shadowColor: string;
      secondary: string;
      primary: string;
      text: string;
      background: string;
      gray: string;
      pure: string;
      lightgray: string;
    };
    styles: {
      nprogress: string;
      link: {
        color: string;
        hover: string;
        active: string;
      }
      box: {
        background: string;
        borderColor: string;
      }
      input: {
        borderColor: string;
        shadow: string;
        disabled: {
          color: string;
          background: string;
        }
      }
    };
    layout: {
      header: {
        background: string;
        borderColor: string;
        shadowColor: string;
        logo: string;
        menu: {
          color: string;
          hover: {
            color: string;
            background: string;
          }
        }
      };
    };
  }
}
