const path = require('path');
const fsPromises = require('fs/promises');

async function processFiles() {
  const FOLDER_NAME = 'secret-folder';
  const pathSecretFolder = path.join(__dirname, FOLDER_NAME);

  try {
    const filesFullNames = await fsPromises.readdir(pathSecretFolder, {
      withFileTypes: true,
    });

    await Promise.all(
      filesFullNames.map(async (dirent) => {
        if (!dirent.isFile()) return;

        const filePath = path.join(dirent.path, dirent.name);
        const fileExtension = path.extname(filePath);
        const fileName = dirent.name;

        const stats = await fsPromises.stat(filePath);

        const fileSizeInKb = Number(stats.size / 1024).toFixed(3);
        const fileExtWithoutDot = fileExtension.slice(1);
        const fileNameWithoutExt = fileName.slice(0, fileName.lastIndexOf('.'));

        console.log(
          `${fileNameWithoutExt} - ${fileExtWithoutDot} - ${fileSizeInKb}kb`,
        );
      }),
    );
  } catch (error) {
    console.error(
      'Oops... Error reading directory or getting file stats:',
      error,
    );
  }
}

processFiles();
