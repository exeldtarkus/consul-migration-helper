/* eslint-disable node/no-unsupported-features/node-builtins */
import consulConfig from '../configs/consul';
import {IGetKey} from '../interfaces/consul_interface';
import {createFolderPath, getConsulFileName} from '../utils/folders_util';
import * as fs from 'fs';
import {singleProgressBar} from '../configs/cli_progress';

const getKVToAndConvertDotEnv = async (params: {
  consulHost: string;
  consulPort: string;
  consulTargetURL: string;
}) => {
  try {
    const consul = consulConfig({
      host: params.consulHost,
      port: params.consulPort,
    });

    const parsedUrl = new URL(params.consulTargetURL);
    let consulPath = parsedUrl.pathname.replace('/ui/dc1/kv/', '');

    if (consulPath.slice(-1) !== '/') {
      consulPath += '/';
    }

    const fileName = consulPath
      .split('/')
      .slice(-2)
      .toString()
      .replace(',', '')
      .trimEnd();

    const getKV: [] = await consul.kv.keys({
      key: consulPath,
    });

    let content = '';

    const progressBar = singleProgressBar(fileName);
    progressBar.start(getKV.length - 1, 0);

    for (let i = 0; i < getKV.length; i++) {
      const item = getKV[i];
      const getItems: IGetKey = await consul.kv.get(item);

      const key = getItems.Key.replace(consulPath, '');
      const value = getItems.Value;

      if (!key) {
        continue;
      }
      content += `${key}=${value ? value : ''}\n`;
      progressBar.update(i);
    }

    fs.writeFileSync(`./output/${fileName}.txt`, content);
    progressBar.stop();
    console.log(`\nData [${fileName}] Already Recorded...\n`);

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
  consulTargetURL: string;
  consulNewFolder: string;
}) => {
  try {
    const consul = consulConfig({
      host: params.consulHost,
      port: params.consulPort,
    });

    const parsedUrl = new URL(params.consulTargetURL);
    const consulPath = parsedUrl.pathname.replace(/\/ui\/dc1\/kv\//, '');

    const savingPath = consulPath + params.consulNewFolder;

    const findFile = fs.readFileSync(params.filePath, 'utf-8');
    const fileLine = findFile.trim().split('\n');

    const progressBar = singleProgressBar(params.consulNewFolder);
    progressBar.start(fileLine.length - 1, 0);

    for (let i = 0; i < fileLine.length; i++) {
      const itemLine = fileLine[i];
      const [key, value] = itemLine.split('=');

      await consul.kv.set(`${savingPath}/${key}`, value);
      progressBar.update(i);
    }

    progressBar.stop();
    console.log(`\nData [${params.consulNewFolder}] Insert on Consul...\n`);

    return true;
  } catch (error) {
    console.log('Error : ', error);
    return false;
  }
};

const getFolderAndKV = async (params: {
  consulHost: string;
  consulPort: string;
  consulTargetURL: string;
}) => {
  try {
    let targetUrl = '';

    const consul = consulConfig({
      host: params.consulHost,
      port: params.consulPort,
    });

    const parsedUrl = new URL(params.consulTargetURL);

    if (parsedUrl.pathname === '/ui/dc1/kv') {
      targetUrl = parsedUrl.pathname + '/';
    } else {
      targetUrl = parsedUrl.pathname;
    }

    let consulPath = targetUrl.replace('/ui/dc1/kv/', '');

    if (consulPath.slice(-1) !== '/') {
      consulPath += '/';
    }

    let getKV: string[];

    if (consulPath === '/') {
      getKV = await consul.kv.keys();
    } else {
      getKV = await consul.kv.keys({
        key: consulPath,
      });
    }

    let fileName = '';
    let content = '';

    const progressBar = singleProgressBar('Process');
    progressBar.start(getKV.length - 1, 0);

    for (let i = 0; i < getKV.length; i++) {
      const item = getKV[i];
      const getItems: IGetKey = await consul.kv.get(item);

      const consulKeyPath = getItems.Key;
      const rawKey = consulKeyPath.split('/');

      const key = rawKey[rawKey.length - 1];
      const value = getItems.Value;

      if (!key) {
        continue;
      }

      const forlderPath = createFolderPath(consulKeyPath);
      const getFileName = getConsulFileName(consulKeyPath);

      if (getFileName !== fileName) {
        fileName = getFileName;
        content = '';
      }

      content += `${key}=${value ? value : ''}\n`;
      fs.writeFileSync(`${forlderPath}/${fileName}.txt`, content);
      progressBar.update(i);
    }

    progressBar.stop();
    console.log('\nData Already Created...\n');

    return true;
  } catch (error) {
    console.log('Error : ', error);
    return false;
  }
};

export {getKVToAndConvertDotEnv, createNewKV, getFolderAndKV};
