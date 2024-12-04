//Code from prompt 1 and 2
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');

async function mainMenu() {
  try {
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
        await moveBetweenFolders();
        break;
      case 'Omdöp alla filer i en mapp':
        await renameAllFiles();
        break;
      case 'Partiell omdöpning av filer':
        await partialRenameFiles();
        break;
      case 'Avsluta':
        console.log('Avslutar...');
        process.exit();
    }
  } catch (error) {
    console.error('Ett fel uppstod:', error);
  }
}

async function moveBetweenFolders() {
  try {
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

    await fs.move(answers.source, answers.destination);
    console.log('Mapparna har flyttats.');
  } catch (err) {
    console.error('Fel vid flyttning av mappar:', err);
  }

  mainMenu();
}

async function renameAllFiles() {
  try {
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
  try {
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
//--------------------------------------------