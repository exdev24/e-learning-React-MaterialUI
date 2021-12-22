import { ServerStyleSheets } from '@material-ui/styles';
import { Request } from 'express';
import Document, { DocumentContext, Head, Main, NextScript } from 'next/document';
import React from 'react';
import { segmentSnippet } from '../client/lib/analytics';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    if (ctx.req && 'session' in ctx.req) {
      updateAttribution(ctx.req as Request);
    }

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <React.Fragment>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </React.Fragment>
      )
    };
  }

  render() {
    return (
      <html>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
          <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" href="/favicon-96x96.png" sizes="96x96" />
          <link
            rel="apple-touch-icon"
            href="https://cdn.create-learn.us/icons/icon-192x192.png"
            sizes="192x192"
          />
          <link
            key="font-Caveat"
            href="https://fonts.googleapis.com/css?family=Caveat&display=swap"
            rel="stylesheet"
          />
          <link rel="manifest" href="/manifest.json" />
          <script dangerouslySetInnerHTML={{ __html: segmentSnippet }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

function updateAttribution(req: Request) {
  const { query, session, params } = req;

  if (typeof query.ref === 'string') {
    session.ref = query.ref;
  } else if (params.ref) {
    session.ref = params.ref;
  }

  // renew cookie every hour
  const ts = Math.floor(Date.now() / (1000 * 60 * 60));
  if (session._ts_ !== ts) {
    session._ts_ = ts;
  }

  if (process.env.NODE_ENV === 'development') {
    if (session.isChanged) console.debug('session updates', session); // eslint-disable-line
  }
}
