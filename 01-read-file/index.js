const path = require('path');
const fs = require('fs');

const fileName = 'text.txt';
const absoluteFilePath = path.join(__dirname, fileName);
const readStream = fs.createReadStream(absoluteFilePath, 'utf-8');

let chuncks = '';

readStream.on('data', (chunck) => (chuncks += chunck));
readStream.on('error', (error) => console.error(error));
readStream.on('end', () => console.log(chuncks));
