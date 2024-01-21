const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'very-useful-info.txt');
const fileContent = '';
const writeStream = fs.createWriteStream(filePath, fileContent, { flags: 'a' });

function handleEndInput() {
  process.stdout.write(
    'Thank you for your efforts. The world is safe, and the super-info is written!\n',
  );
  writeStream.end();
  process.exit();
}

process.stdout.write('Hello, superhero! Please type something useful:\n');
process.stdout.write('(type "exit" or press "ctrl+c" to finish)\n');

process.stdin.on('data', (input) => {
  const userInput = input.toString().trim();

  if (userInput.toLowerCase() === 'exit') {
    handleEndInput();
  }

  writeStream.write(userInput + '\n');
});

process.on('SIGINT', handleEndInput);
