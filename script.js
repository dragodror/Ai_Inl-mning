const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

async function mainMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Välj en åtgärd:',
      choices: [
        'Flytta mellan mappar',
        'Omdöp alla filer i en mapp',
        'Partiell omdöpning av filer',
        'Avsluta'
      ]
    }
  ]);

  switch (answers.action) {
    case 'Flytta mellan mappar':
      moveBetweenFolders();
      break;
    case 'Omdöp alla filer i en mapp':
      renameAllFiles();
      break;
    case 'Partiell omdöpning av filer':
      partialRenameFiles();
      break;
    case 'Avsluta':
      console.log('Avslutar...');
      process.exit();
  }
}

async function moveBetweenFolders() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'source',
      message: 'Ange källmappens sökväg:'
    },
    {
      type: 'input',
      name: 'destination',
      message: 'Ange destinationsmappens sökväg:'
    }
  ]);

  try {
    await fs.move(answers.source, answers.destination);
    console.log('Mapparna har flyttats.');
  } catch (err) {
    console.error('Fel vid flyttning av mappar:', err);
  }

  mainMenu();
}

async function renameAllFiles() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'folder',
      message: 'Ange mappens sökväg:'
    },
    {
      type: 'input',
      name: 'newName',
      message: 'Ange det nya namnet för filerna:'
    }
  ]);

  try {
    const files = await fs.readdir(answers.folder);
    files.forEach((file, index) => {
      const ext = path.extname(file);
      const newFileName = `${answers.newName}_${index + 1}${ext}`;
      fs.renameSync(path.join(answers.folder, file), path.join(answers.folder, newFileName));
    });
    console.log('Alla filer har omdöpts.');
  } catch (err) {
    console.error('Fel vid omdöpning av filer:', err);
  }

  mainMenu();
}

async function partialRenameFiles() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'folder',
      message: 'Ange mappens sökväg:'
    },
    {
      type: 'input',
      name: 'pattern',
      message: 'Ange regex-mönstret för att matcha filer:'
    },
    {
      type: 'input',
      name: 'replacement',
      message: 'Ange ersättningstexten:'
    }
  ]);

  try {
    const regex = new RegExp(answers.pattern);
    const files = await fs.readdir(answers.folder);
    files.forEach((file) => {
      if (regex.test(file)) {
        const newFileName = file.replace(regex, answers.replacement);
        fs.renameSync(path.join(answers.folder, file), path.join(answers.folder, newFileName));
      }
    });
    console.log('Filerna har omdöpts delvis.');
  } catch (err) {
    console.error('Fel vid partiell omdöpning av filer:', err);
  }

  mainMenu();
}

mainMenu();