// polyfill for luxon
import 'core-js/features/math/sign';
import 'core-js/features/math/trunc';

import '../client/global.css';
import 'react-dropzone-uploader/dist/styles.css';
import 'draft-js/dist/Draft.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'emoji-mart/css/emoji-mart.css';

import { ApolloProvider } from '@apollo/react-common';
import { getDataFromTree } from '@apollo/react-ssr';
import { ThemeProvider } from '@material-ui/core';
import { ApolloClient } from 'apollo-client';
import { captureException, configureScope, init } from '@sentry/browser';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from '../client/components/alert-template';
import { AccountProvider } from '../client/context/account';
import { getApolloClient } from '../client/graphql/apollo';
import {
  GetUserChildrenQuery,
  UserChildrenResponse
} from '../client/graphql/user-queries';
import { identify } from '../client/lib/analytics';
import { persistUserTraits } from '../client/lib/user-source';
import { sentryOpts } from '../client/runtime';
import theme from '../client/theme';
import { appWithTranslation } from '../shared/i18n';

interface ApolloAppProps extends AppProps {
  apolloState: any;
  apollo: ApolloClient<any>;
}

if (sentryOpts.enabled) {
  init(sentryOpts);
}

class AppRoot extends App<ApolloAppProps> {
  static async getInitialProps({ AppTree, Component, ctx }: AppContext) {
    let pageProps = ctx.query;
    let apolloState = null;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const headers = ctx.req ? ctx.req.headers : {};
    const apollo = getApolloClient(null, headers);

    if (ctx.res) {
      // When redirecting, the response is finished.
      // No point in continuing to render
      if (ctx.res.headersSent || ctx.res.finished) {
        return {
          pageProps
        };
      }

      try {
        await getDataFromTree(
          <AppTree pageProps={pageProps} apolloState={apolloState} apollo={apollo} />
        );
      } catch (error) {
        captureException(error);
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        if (process.env.NODE_ENV !== 'production') {
          console.error('GraphQL error occurred [getDataFromTree]', error); //eslint-disable-line
        }
      }

      Head.rewind();

      apolloState = apollo.extract();
    }

    // To avoid calling initApollo() twice in the server we send the Apollo Client as a prop
    // to the component, otherwise the component would have to call initApollo() again but this
    // time without the context, once that happens the following code will make sure we send
    // the prop as `null` to the browser
    (apollo as any).toJSON = () => {
      return null;
    };

    return {
      apollo,
      apolloState,
      pageProps
    };
  }

  apollo: ApolloClient<any>;

  constructor(props: ApolloAppProps) {
    super(props);
    this.apollo = props.apollo || getApolloClient(props.apolloState);
  }

  componentDidCatch(err: Error, errorInfo: any) {
    configureScope(scope => {
      if (err.message) {
        // De-duplication currently doesn't work correctly for SSR / browser errors
        // so we force deduplication by error message if it is present
        scope.setFingerprint([err.message]);
      }

      scope.setExtras(errorInfo);
      captureException(err);
    });

    super.componentDidCatch(err, errorInfo);
  }

  componentDidMount() {
    persistUserTraits(this.props.router.asPath, this.props.router.query);
    // Remove the server-side injected CSS.
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const data = this.apollo.readQuery<UserChildrenResponse>({
      query: GetUserChildrenQuery
    });

    if (data.user) {
      identify(data.user);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={this.apollo}>
            <AccountProvider>
              <AlertProvider template={AlertTemplate} position="bottom center">
                <Component {...pageProps} />
              </AlertProvider>
            </AccountProvider>
          </ApolloProvider>
        </ThemeProvider>
      </>
    );
  }
}

export default appWithTranslation(AppRoot);
