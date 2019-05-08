import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    // body背景颜色
    background: string;
    // 一些主色调
    colors: {
      blue: string;
      fontColor: string;
    }
    // 链接默认theme
    href: {
      color: string;
      hover: string;
      active: string;
    }
    // header的theme
    header: {
      background: string;
      borderColor: string;
      shadowColor: string;
      logo: string;
      menu: {
        color: string;
      }
    }
  }
}
