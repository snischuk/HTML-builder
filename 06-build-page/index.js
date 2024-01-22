const fs = require('fs').promises;
const path = require('path');

const SRC_FOLDER = 'components';
const STYLES_FOLDER = 'styles';
const ASSETS_FOLDER = 'assets';
const TEMPLATE_FILE = 'template.html';
const DIST_FOLDER = 'project-dist';

const srcFolderPath = path.join(__dirname, SRC_FOLDER);
const stylesFolderPath = path.join(__dirname, STYLES_FOLDER);
const assetsFolderPath = path.join(__dirname, ASSETS_FOLDER);
const templateFilePath = path.join(__dirname, TEMPLATE_FILE);
const distFolderPath = path.join(__dirname, DIST_FOLDER);

async function replaceTemplateTags(templateContent) {
  const tagRegex = /\{\{(.+?)\}\}/g;
  const matches = templateContent.matchAll(tagRegex);

  for (const match of matches) {
    const [fullMatch, tagName] = match;
    const componentFilePath = path.join(srcFolderPath, `${tagName}.html`);

    try {
      const componentContent = await fs.readFile(componentFilePath, 'utf-8');
      templateContent = templateContent.replace(fullMatch, componentContent);
    } catch (error) {
      console.error(error.message);
    }
  }

  return templateContent;
}

async function copyDir(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });

    const files = await fs.readdir(source);

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      try {
        const stats = await fs.stat(sourcePath);

        if (stats.isFile()) {
          await fs.copyFile(sourcePath, destinationPath);
        }

        if (stats.isDirectory()) {
          await copyDir(sourcePath, destinationPath);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function mergeStyles(srcFolderPath, distFolderPath) {
  try {
    await fs.mkdir(distFolderPath, { recursive: true });

    const stylesFiles = await fs.readdir(srcFolderPath, {
      withFileTypes: true,
      recursive: true,
    });

    const cssFiles = stylesFiles.filter(
      (file) => file.isFile() && file.name.endsWith('.css'),
    );

    const concatenatedStyles = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(srcFolderPath, file.name);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return fileContent + '\n';
      }),
    );

    await fs.writeFile(
      path.join(distFolderPath, 'style.css'),
      concatenatedStyles.join(''),
    );
  } catch (error) {
    console.error(error.message);
  }
}

async function buildPage() {
  try {
    await fs.mkdir(distFolderPath, { recursive: true });

    const templateContent = await fs.readFile(templateFilePath, 'utf-8');
    const modifiedTemplate = await replaceTemplateTags(templateContent);

    await fs.writeFile(
      path.join(distFolderPath, 'index.html'),
      modifiedTemplate,
    );
    await copyDir(assetsFolderPath, path.join(distFolderPath, 'assets'));
    await mergeStyles(stylesFolderPath, distFolderPath);
  } catch (error) {
    console.error(error.message);
  }
}

buildPage();
