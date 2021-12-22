import { initModels } from 'cl-models';
import config from 'config';
export default initModels(config.get('rds'));
