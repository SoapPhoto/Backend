import Document, {
  DocumentContext, Head, Main, NextScript,
} from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as _ from '@lib/common/utils';

const isProd = process.env.NODE_ENV === 'production';

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
      });
      const initialProps = await Document.getInitialProps(ctx);
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
      sheet.seal();
    }
  }

  public render() {
    return (
      <html lang="zh-CN" {...{ 'xmlns:wb': 'http://open.weibo.com/wb' } as any}>
        <Head>
          <meta charSet="utf-8" />
          <meta name="renderer" content="webkit" />
          {/* eslint-disable-next-line max-len */}
          <meta name="keywords" content="soap, picture, great photographers, photographers, photography images, photography, photos, sell photos online, sell your photos, share photos, your photos, 图片, 照片" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" type="image/ico" href="/favicon.ico" />
          <link rel="stylesheet" href="//fonts.loli.net/css?family=Noto+Sans+SC|Rubik" />
          {
            isProd && (
              <>
                <script async src="https://www.googletagmanager.com/gtag/js?id=UA-150810690-1" />
                <script dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'UA-150810690-1');`,
                }}
                />
              </>
            )
          }
        </Head>
        <body id="body">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
