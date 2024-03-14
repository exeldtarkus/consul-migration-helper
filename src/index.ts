import {createNewKV, getKVToAndConvertDotEnv} from './helpers/consul_helpers';
import {close, question} from './helpers/readline_helper';

let alreadyRunAgain = false;
let host = '';
let port = '';

const runningAgain = async () => {
  const runAgain = await question('\nRunning Again ? [Y/N]: ');

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
  if (!alreadyRunAgain) {
    await question('Migrate Consul - [Press Any Key to Continue] ...');
    host = await question('Insert Consul Host : ');
    port = await question('Insert Consul Port : ');
  }

  const questionOptions = `
Migrate Consul - Select Options :
  1. Get Key & Value on Consul
  2. Migrate Key & Value on Consul
Select your choice : `;

  const optionsKey = await question(questionOptions);

  if (isNaN(optionsKey)) {
    console.log('Key Not Interger');
    runningAgain();
    // close('Key Not Interger');
  }

  switch (Number(optionsKey)) {
    case 1: {
      const consulURL = await question(
        '\nEnter the ALL target consul URL from which the data will be retrieved : '
      );
      const getData = await getKVToAndConvertDotEnv({
        consulHost: host,
        consulPort: port,
        consulURLPath: consulURL,
      });

      if (getData) {
        await question(
          '\nThe data will be generated on folder "output" with the name "output_consul.txt". Please Enter To Continue ....'
        );
      }

      runningAgain();
      break;
    }

    case 2: {
      await question(
        '\nFor insert file Example you can use ./ouput/output_consul.txt. Please Enter To Continue .... '
      );
      const consulURL = await question(
        '\nEnter the ALL target consul URL for Create New Key & Value : '
      );
      const consulNewForder = await question(
        '\nEnter Name for new forder consul : '
      );
      const filePathUpload = await question('\nEnter file Upload Path : ');
      await createNewKV({
        consulHost: host,
        consulPort: port,
        consulURLPath: consulURL,
        consulNewFolder: consulNewForder,
        filePath: filePathUpload,
      });

      runningAgain();
      break;
    }

    default:
      console.log('Key Not Match');
      runningAgain();
      // close('Key Not Match');
      break;
  }
}

main().catch(err => console.error('Error: ', err));
