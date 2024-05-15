import cliProgress from 'cli-progress';

const singleProgressBar = (progressName?: string) => {
  return new cliProgress.SingleBar({
    format:
      `[${progressName ? progressName : 'Progress'}] |` +
      '{bar}' +
      '| {percentage}% ~ [{value}/{total}]',
    barCompleteChar: '\u2588',
    // barIncompleteChar: '\u2591',
    hideCursor: true,
  });
};

export {singleProgressBar};
