/* eslint-disable no-console */
import moment from 'moment';
import dotenv from 'dotenv';
import chalk from 'chalk';
import {oneLine} from 'common-tags';

dotenv.config();

enum ELogLevels {
  error = '[ERROR]',
  warn = '[WARNING]',
  info = '[INFO]',
  http = '[HTTP]',
  debug = '[DEBUG]',
  nothing = '[NOTHING]',
}

enum ELogStage {
  start = '[START]',
  process = '[PROCESSING]',
  end = '[END]',
}

const loggerConfig = (logLevel: ELogLevels, ...str: any[]) => {
  if (str?.length > 0) {
    const mappingStr: Array<string> = [];
    for (const itemStr of str) {
      let convertToString = '';
      try {
        if (typeof itemStr !== 'string') {
          convertToString = oneLine`${JSON.stringify(itemStr)}`;
        } else {
          convertToString = itemStr;
        }
      } catch (err) {
        return console.log(
          chalk.yellow(
            `${ELogLevels.warn} | [Cannot Convert JSON] - [Please Manual Check Log] - ${err}`
          )
        );
      }
      mappingStr.push(convertToString);
    }

    const fullStr = mappingStr.join(' - ');

    switch (logLevel) {
      case ELogLevels.info: {
        return console.log(chalk.green(`${ELogLevels.info}    | `), fullStr);
      }

      case ELogLevels.warn: {
        return console.log(chalk.yellow(`${ELogLevels.warn} | `), fullStr);
      }

      case ELogLevels.debug: {
        if (process.env.APP_DEBUG === 'true') {
          return console.log(
            chalk.magenta(`${ELogLevels.debug}   | `),
            fullStr
          );
        }
        break;
      }

      case ELogLevels.error: {
        return console.log(
          chalk.red(
            `${ELogLevels.error} - [${moment().format(
              'YYYY-MM-DD HH:mm:ss'
            )}] | `
          ),
          fullStr
        );
      }

      case ELogLevels.nothing: {
        console.log(chalk.white(`${ELogLevels.nothing}   | `), fullStr);
        break;
      }

      default: {
        return console.log(chalk.red('[ERROR] - [logLevel] - [NOT FOUND]'));
      }
    }
  }
};

const logger = () => {};

logger.info = (...str: any[]) => {
  return loggerConfig(ELogLevels.info, ...str);
};

logger.warn = (...str: any[]) => {
  return loggerConfig(ELogLevels.warn, ...str);
};

logger.error = (...str: any[]) => {
  return loggerConfig(ELogLevels.error, ...str);
};

logger.nothing = (...str: any[]) => {
  return loggerConfig(ELogLevels.nothing, ...str);
};

logger.debug = (...str: any[]) => {
  return loggerConfig(ELogLevels.debug, ...str);
};

const log = (...str: any[]) => {
  if (str.length > 0) {
    let fullStr = str[0];
    for (let i = 1; i < str.length; i++) {
      fullStr += ` - ${str[i]}`;
    }
    console.log(fullStr);
  }
};

export {log, logger, ELogStage, ELogLevels};
