const fs = require('fs');
const path = require('path');

const FOLDER_TO_COPY = 'files';
const FOLDER_COPIED = 'files-copy';

const pathFolderToCopy = path.join(__dirname, FOLDER_TO_COPY);
const pathFolderCopied = path.join(__dirname, FOLDER_COPIED);

function clearDir(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) return console.error(err);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      deleteFile(filePath);
    });
  });
}

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) return console.error(err);
  });
}

function copyFile(sourcePath, destinationPath) {
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationPath);

  readStream.pipe(writeStream);

  readStream.on('error', (error) => {
    console.error(
      `Oops! Error copying file ${path.basename(sourcePath)}: ${error.message}`,
    );
  });
}

function handleReadDir(err, files) {
  if (err) return console.error(err);

  files.forEach((file) => {
    if (file.isFile()) {
      const sourcePath = path.join(pathFolderToCopy, file.name);
      const destinationPath = path.join(pathFolderCopied, file.name);

      copyFile(sourcePath, destinationPath);
    }
  });
}

function handleMkDir(err) {
  if (err) return console.error(err);

  clearDir(pathFolderCopied);
  fs.readdir(pathFolderToCopy, { withFileTypes: true }, handleReadDir);
}

function copyDir() {
  fs.mkdir(pathFolderCopied, { recursive: true }, handleMkDir);
}

copyDir();
