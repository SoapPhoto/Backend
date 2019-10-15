import Document, {
  DocumentContext, Head, Main, NextScript,
} from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@lib/common/utils';

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      console.time('renderPage');
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });
      console.timeEnd('renderPage');
      console.time('Document');
      const initialProps = await Document.getInitialProps(ctx);
      console.timeEnd('Document');
      return {
        ...initialProps,
        styles: [(
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )],
      };
    } finally {
      console.time('sheet');
      sheet.seal();
      console.timeEnd('sheet');
    }
  }

  public render() {
    return (
      <html lang="zh-CN">
        <Head>
          <meta charSet="utf-8" />
          <meta name="renderer" content="webkit" />
          {/* eslint-disable-next-line max-len */}
          <meta name="keywords" content="soap, picture, great photographers, photographers, photography images, photography, photos, sell photos online, sell your photos, share photos, your photos, 图片, 照片" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
          <link rel="preload" as="style" href="//fonts.loli.net/css?family=Noto+Sans+SC|Rubik" />
        </Head>
        <body id="body">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
