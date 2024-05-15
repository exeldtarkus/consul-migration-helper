import {
  createNewKV,
  getFolderAndKV,
  getKVToAndConvertDotEnv,
} from './src/helpers/consul_helpers';

const test = async () => {
  const data = await getFolderAndKV({
    consulHost: '10.2.21.4',
    consulPort: '80',
    consulTargetURL: 'http://10.2.21.4/ui/dc1/kv/test',
  });

  console.log('data :>> ', data);
};

const test2 = async () => {
  const data = await getKVToAndConvertDotEnv({
    consulHost: '10.2.21.4',
    consulPort: '80',
    consulTargetURL: 'http://10.2.21.4/ui/dc1/kv/moservice/sp-booking-api/',
  });

  console.log('data :>> ', data);
};

const test3 = async () => {
  const data = await createNewKV({
    consulHost: '10.2.21.4',
    consulPort: '80',
    consulTargetURL: 'http://10.2.21.4/ui/dc1/kv/test/test1/',
    filePath: './output/sp-booking-api.txt',
    consulNewFolder: 'sp-booking-api-test',
  });

  console.log('data :>> ', data);
};

test();
