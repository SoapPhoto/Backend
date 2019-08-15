import 'styled-components';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
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
      danger: string;
      lightgray: string;
      baseGreen: string;
    };
    styles: {
      nprogress: string;
      link: {
        color: string;
        hover: string;
        active: string;
      };
      box: {
        background: string;
        borderColor: string;
      };
      input: {
        borderColor: string;
        background: string;
        shadow: string;
        disabled: {
          color: string;
          background: string;
        };
        hover: {
          shadow: string;
          borderColor: string;
        };
      };
      collection: {
        background: string;
        addPicture: {
          background: string;
          color: string;
        };
      };
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
          };
        };
      };
    };
  }
}
