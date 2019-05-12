import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    nprogress: string;
    /**
     * body背景颜色
     */
    background: string;
    // 一些主色调
    colors: {
      shadowColor: string;
      borderColor: string;
      blue: string;
      fontColor: string;
    }
    // 链接默认theme
    link: {
      color: string;
      hover: string;
      active: string;
    }
    box: {
      background: string;
      borderColor: string;
    }
    // header的theme
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
    }
  }
}
