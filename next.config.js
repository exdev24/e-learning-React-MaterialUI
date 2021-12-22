const withSourceMaps = require('@zeit/next-source-maps')();
const withPWA = require('next-pwa');
const config = require('config');

const isDeployment = process.env.BUILD_ENV === 'deployment';

let sentryPlugin = null;
if (isDeployment) {
  try {
    const SentryWebpackPlugin = require('@sentry/webpack-plugin');
    sentryPlugin = new SentryWebpackPlugin({
      include: 'build',
      ignore: ['node_modules']
    });
  } catch (err) {
    // ignore
  }
}

module.exports = withPWA(
  withSourceMaps({
    env: {
      SENTRY_DSN: config.get('sentry.dsn')
    },
    distDir: 'build/app',
    typescript: {
      ignoreDevErrors: true
    },
    publicRuntimeConfig: {
      baseUrl: config.get('baseUrl'),
      serverPort: config.get('server.port'),
      sentry: config.get('sentry'),
      segment: config.get('segment'),
      flash: config.get('flash'),
      chatbot: config.get('chatbot')
    },
    pwa: {
      disable: !isDeployment,
      dest: 'public'
    },
    webpack: (webpackConfig, options) => {
      if (options.isServer) {
        webpackConfig.resolve.alias['@sentry/browser'] = '@sentry/node';
      }

      if (sentryPlugin) {
        webpackConfig.plugins.push(sentryPlugin);
      }

      return webpackConfig;
    }
  })
);
