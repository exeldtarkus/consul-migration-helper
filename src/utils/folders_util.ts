const getConsulFileName = (urlPath: string): string => {
  const pathName = urlPath.split('/');
  const result = pathName[pathName.length - 2];

  return result;
};

export {getConsulFileName};
