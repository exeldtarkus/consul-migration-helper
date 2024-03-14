import * as readline from 'readline';

const updateProgressBar = (params: {
  keysProcessed: number;
  totalKeys: number;
  progressBarWidth: number;
}) => {
  const progress = Math.ceil(
    (params.keysProcessed / params.totalKeys) * params.progressBarWidth
  );
  const progressBar =
    Array(progress).fill('=').join('') +
    Array(params.progressBarWidth - progress)
      .fill('-')
      .join('');
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(
    `Progress: [${progressBar}] ${params.keysProcessed}/${params.totalKeys}`
  );
};

export {updateProgressBar};
