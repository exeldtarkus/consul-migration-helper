/* eslint-disable node/no-unsupported-features/node-builtins */
import consulConfig from '../config/consul';
import {updateProgressBar} from '../utils/progress_bar_util';
import * as fs from 'fs';

interface IGetKey {
  LockIndex: number;
  Key: string;
  Flags: number;
  Value: null | any;
  CreateIndex: number;
  ModifyIndex: number;
}

const getKVToAndConvertDotEnv = async (params: {
  consulHost: string;
  consulPort: string;
  consulURLPath: string;
}) => {
  try {
    const consul = consulConfig({
      host: params.consulHost,
      port: params.consulPort,
    });

    const parsedUrl = new URL(params.consulURLPath);
    const consulPath = parsedUrl.pathname.replace('/ui/dc1/kv/', '');

    const getKV: [] = await consul.kv.keys({
      key: consulPath,
    });

    let content = '';

    const totalKeys = getKV.length;
    let keysProcessed = 0;

    const progressBarWidth = 30;
    const progressBarIncrement = Math.ceil(totalKeys / progressBarWidth);

    for (const item of getKV) {
      const getItems: IGetKey = await consul.kv.get(item);

      const key = getItems.Key.replace(consulPath, '');
      const value = getItems.Value;

      if (!key || !value) {
        continue;
      }
      content += `${key}=${value}\n`;

      keysProcessed += 1;
      if (
        keysProcessed % progressBarIncrement === 0 ||
        keysProcessed === totalKeys
      ) {
        updateProgressBar({keysProcessed, progressBarWidth, totalKeys});
      }

      if (keysProcessed === totalKeys) {
        console.log('\nFile written successfully!');
      }
    }

    fs.writeFileSync('./output/output_consul.txt', content);
    return true;
  } catch (error) {
    console.log('\nError : ', error);
    return false;
  }
};

const createNewKV = async (params: {
  consulHost: string;
  consulPort: string;
  filePath: string;
  consulURLPath: string;
  consulNewFolder: string;
}) => {
  try {
    const consul = consulConfig({
      host: params.consulHost,
      port: params.consulPort,
    });

    const parsedUrl = new URL(params.consulURLPath);
    const consulPath = parsedUrl.pathname.replace(/\/ui\/dc1\/kv\//, '');

    const savingPath = consulPath + params.consulNewFolder;

    const findFile = fs.readFileSync(params.filePath, 'utf-8');
    const fileLine = findFile.trim().split('\n');

    const totalKeys = fileLine.length;
    let keysProcessed = 0;

    const progressBarWidth = 30;
    const progressBarIncrement = Math.ceil(totalKeys / progressBarWidth);

    for (const i in fileLine) {
      const itemLine = fileLine[i];
      const [key, value] = itemLine.split('=');

      keysProcessed += 1;

      if (
        keysProcessed % progressBarIncrement === 0 ||
        keysProcessed === totalKeys
      ) {
        updateProgressBar({keysProcessed, progressBarWidth, totalKeys});
      }

      if (keysProcessed === totalKeys) {
        console.log(
          `\nYour new file : ${params.consulURLPath}${params.consulNewFolder}`
        );
        console.log('\nConsul Already Create successfully!');
      }
      await consul.kv.set(`${savingPath}/${key}`, value);
    }
    return true;
  } catch (error) {
    console.log('Error : ', error);
    return false;
  }
};

export {getKVToAndConvertDotEnv, createNewKV};
