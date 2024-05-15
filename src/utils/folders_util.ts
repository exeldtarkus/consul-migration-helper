import * as fs from 'fs';

const getConsulFileName = (urlPath: string): string => {
  const pathName = urlPath.split('/');
  const result = pathName[pathName.length - 2];

  return result;
};

const getConsulFolderName = (urlPath: string): string => {
  const urlTarget = urlPath.split('/');

  const folderPathArray = urlTarget;
  folderPathArray.splice(-2);

  let result = '';
  for (const i in folderPathArray) {
    const item = folderPathArray[i];
    result += `/${item}`;
  }

  return result;
};

const createFolderPath = (urlPath: string): string => {
  const urlTarget = urlPath.split('/');

  const folderPathArray = urlTarget;
  folderPathArray.splice(-2);

  let dirPath = './output';

  for (const i in folderPathArray) {
    const itemFolder = folderPathArray[i];
    dirPath += `/${itemFolder}`;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  }

  return dirPath;
};

export {getConsulFileName, getConsulFolderName, createFolderPath};
