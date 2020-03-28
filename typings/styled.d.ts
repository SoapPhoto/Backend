import { } from 'styled-components';


declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  export interface DefaultTheme {
    isMobile: boolean;
    name: string;
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
    width: {
      wrapper: number;
    };
    height: {
      header: number;
      footer: number;
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
      notification: {
        read: {
          background: string;
        };
      };
      scrollbar: {
        background: string;
        hover: string;
        active: string;
      };
      picture: {
        shadow: {
          opacity: number;
        };
      };
      skeleton: {
        accents1: string;
        accents2: string;
      };
      popover: {
        boxShadow1: string;
        boxShadow2: string;
        boxShadow3: string;
      };
    };
    layout: {
      header: {
        background: string;
        borderWidth: number;
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
      picture: {
        wrapper: {
          backgroundColor: string;
        };
      };
    };
    mapbox: {
      style: string;
    };
  }
}
