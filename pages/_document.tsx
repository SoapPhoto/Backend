import Document, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
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
      <html>
        <Head>
          <meta charSet="utf-8" />
          <meta name="renderer" content="webkit" />
          <link href="//fonts.loli.net/css?family=Noto+Sans+SC|Rubik" rel="stylesheet"/>
        </Head>
        <body id="body">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
