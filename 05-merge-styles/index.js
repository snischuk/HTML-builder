const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const SRC_FOLDER = 'styles';
const DIST_FOLDER = 'project-dist';

const srcFolderPath = path.join(__dirname, SRC_FOLDER);
const distFolderPath = path.join(__dirname, DIST_FOLDER);

async function mergeStyles(srcFolderPath, distFolderPath) {
  try {
    await fsp.mkdir(distFolderPath, { recursive: true });

    const stylesFiles = await fsp.readdir(srcFolderPath, {
      withFileTypes: true,
      recursive: true,
    });
    const cssFiles = stylesFiles.filter(
      (file) => file.isFile() && file.name.endsWith('.css'),
    );

    const writeStream = fs.createWriteStream(
      path.join(distFolderPath, 'bundle.css'),
      { encoding: 'utf-8' },
    );

    await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(srcFolderPath, file.name);
        const readStream = fs.createReadStream(filePath, 'utf-8');

        await new Promise((resolve, reject) => {
          readStream.pipe(writeStream, { end: false });
          readStream.on('error', reject);
          readStream.on('end', resolve);
        });

        writeStream.write('\n');
      }),
    );

    writeStream.end();
  } catch (error) {
    console.error(error.message);
  }
}

mergeStyles(srcFolderPath, distFolderPath);
