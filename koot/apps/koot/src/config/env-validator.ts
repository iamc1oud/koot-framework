import * as dotenv from 'dotenv';

import * as path from 'path';
import { cwd } from 'process';

dotenv.config();

const envFileMapper = {
    production: '.env.production',
    development: '.env'
}

const selectedEnvFile = envFileMapper[process.env.NODE_ENV as any] || '.env';

const pathToDotEnv = `${cwd()}/apps/koot/src/${selectedEnvFile}`;

// if (process.env.MIGRATION) {
//   pathToDotEnv = path.join(__dirname, `../${selectedEnvFile}`);
// }

const { error } = dotenv.config({ path: pathToDotEnv });

if (error && !process.env.LAMBDA_TASK_ROOT) throw error;