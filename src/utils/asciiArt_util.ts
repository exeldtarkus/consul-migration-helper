import figlet from 'figlet';

const textASCIIArt = (text: string) => {
  return figlet(text, (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log('\n');
    console.log(data);
  });
};

export {textASCIIArt};
