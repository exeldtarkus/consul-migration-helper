import Consul from 'consul';

interface IConsulConfig {
  host: string;
  port: string;
}

const configConsul = (params: IConsulConfig): Consul.Consul => {
  const config = new Consul({host: params.host, port: params.port});
  return config;
};

export {IConsulConfig};
export default configConsul;
