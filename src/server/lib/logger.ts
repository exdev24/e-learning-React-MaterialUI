import config from 'config';
import pino from 'pino';
export default pino({
  ...config.get('logger'),
  formatters: {
    level: level => ({
      level
    })
  }
});
