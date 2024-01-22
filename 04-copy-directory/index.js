const fsPromise = require('fs/promises');
const path = require('path');

const FOLDER_TO_COPY = 'files';
const FOLDER_COPIED = 'files-copy';

const pathFolderToCopy = path.join(__dirname, FOLDER_TO_COPY);
const pathFolderCopied = path.join(__dirname, FOLDER_COPIED);

async function copyDir(source, destination) {
  try {
    await fsPromise.mkdir(destination, { recursive: true });
    const files = await fsPromise.readdir(source);

    files.forEach(async (file) => {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      try {
        const stats = await fsPromise.stat(sourcePath);

        if (stats.isFile()) {
          await fsPromise.copyFile(sourcePath, destinationPath);
        }

        if (stats.isDirectory()) {
          await copyDir(sourcePath, destinationPath);
        }
      } catch (error) {
        console.error(error.message);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

copyDir(pathFolderToCopy, pathFolderCopied);
