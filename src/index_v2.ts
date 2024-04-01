/* eslint-disable node/no-unsupported-features/node-builtins */
import {createNewKV, getKVToAndConvertDotEnv} from './helpers/consul_helpers';
import {close, question} from './helpers/readline_helper';

let alreadyRunAgain = false;
let host = '';
let port = '80';

const runningAgain = async () => {
  const runAgain = await question('\nRunning Again ? [y/N]: ');

  if (['Y', 'y', 'YES', 'Yes', 'yes'].includes(runAgain)) {
    alreadyRunAgain = true;
    return main();
  }

  if (['N', 'n', 'NO', 'No', 'no'].includes(runAgain)) {
    return close('Bye...');
  }

  runningAgain();
};

async function main() {
  await question('Migrate Consul - [Press Any Key to Continue] ...');

  const questionOptions = `
Migrate Consul - Select Options :
  1. Get Key & Value on Consul
  2. Migrate Key & Value on Consul
Select your choice : `;

  const optionsKey = await question(questionOptions);

  if (isNaN(optionsKey)) {
    console.log('Key Not Interger');
    runningAgain();
  }

  const consulTargetURL = await question('\nEnter All Target Consul URL : ');
  if (!consulTargetURL) {
    console.log('Must Insert consul Target');
    runningAgain();
  }

  if (!alreadyRunAgain) {
    port = await question('Consul Port (Default 80)    : ');
    if (!port) {
      port = '80';
    }
  }

  const targetURL = new URL(consulTargetURL);
  host = targetURL.host;

  switch (Number(optionsKey)) {
    case 1: {
      const getData = await getKVToAndConvertDotEnv({
        consulHost: host,
        consulPort: port,
        consulTargetURL: consulTargetURL,
      });

      if (getData) {
        await question(
          '\nThe data will be generated on folder "output". Please Enter To Continue ....'
        );
      }

      runningAgain();
      break;
    }

    case 2: {
      await question(
        '\nExample Input you can see ./ouput/output_consul.txt. Please Enter To Continue .... '
      );
      const filePathUpload = await question('\nFile Upload Path : ');

      const configText = filePathUpload.split('/');
      const placeHolder = configText[configText.length - 1].replace('.txt', '');

      let consulNewForder = await question(
        `\nEnter Name for new FOLDER in consul Default (${placeHolder}) : `
      );

      if (!consulNewForder) {
        consulNewForder = placeHolder;
      }

      console.log(`Created New Folder ==> ${consulNewForder}`);
      await createNewKV({
        consulHost: host,
        consulPort: port,
        consulTargetURL: consulTargetURL,
        consulNewFolder: consulNewForder,
        filePath: filePathUpload,
      });

      runningAgain();
      break;
    }

    default:
      console.log('Key Not Match');
      runningAgain();
      break;
  }
}

main().catch(err => console.error('Error: ', err));
