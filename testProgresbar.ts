import cliProgress from 'cli-progress';
import {singleProgressBar} from './src/configs/cli_progress';

// create a new progress bar instance and use shades_classic theme
// const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
const bar1 = singleProgressBar();

const fileSize = 100000000;

// start the progress bar with a total value of 200 and start value of 0
// bar1.start(fileSize, 0);

bar1.start(fileSize, 0, {
  speed: 'N/A',
});

const cnt = 0;

for (let index = 1; index < fileSize; index++) {
  // update values
  // bar1.increment();
  bar1.update(index);

  // stop the bar
  // bar1.stop();
}
bar1.stop();
