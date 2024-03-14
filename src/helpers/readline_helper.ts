/* eslint-disable no-process-exit */
import rl from '../config/readline';

const close = (message?: string) => {
  rl.on('close', () => {
    console.log(
      message ? message + '\nExiting Process...' : '\nExiting Process...'
    );
    process.exit();
  });
  return rl.close();
};

const question = (q: string): Promise<any> => {
  return new Promise(resolve => {
    rl.question(q, userInput => {
      resolve(userInput);
    });
  });
};

export {question, close};
