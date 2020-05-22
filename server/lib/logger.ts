import config from 'config';
import pino from 'pino';

const logger = pino(config.get('logger'));

export const createLogger = (
  fn: string,
  bindings: Partial<{ classId: string; userId: string; studentId: string }>
) =>
  logger.child({
    fn,
    ...bindings
  });

export default logger;
