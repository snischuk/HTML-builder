const fsPromise = require('fs/promises');
const path = require('path');

const FOLDER_TO_COPY = 'files';
const FOLDER_COPIED = 'files-copy';

const pathFolderToCopy = path.join(__dirname, FOLDER_TO_COPY);
const pathFolderCopied = path.join(__dirname, FOLDER_COPIED);

async function copyDir(source, destination) {
  try {
    await removeDir(destination);
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
        return error;
      }
    });
  } catch (error) {
    return error;
  }
}

async function removeDir(directory) {
  try {
    const stat = await fsPromise.stat(directory);
    if (stat.isDirectory()) {
      await fsPromise.rm(directory, { recursive: true });
    }
  } catch (error) {
    return error;
  }
}

copyDir(pathFolderToCopy, pathFolderCopied);
