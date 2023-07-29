/* eslint-disable import/no-cycle */
import { ipcMain, dialog } from 'electron';
import {
  initialize,
  getSheets,
  configure,
  getWorkBook,
  changePhones,
} from '../tools/phone';
import { getMainWindow } from '../main';

export default () => {
  ipcMain.handle('initialize-phone', async () => {
    const mainWindow = getMainWindow();
    if (mainWindow === null) return;
    try {
      const { filePaths } = await dialog.showOpenDialog(mainWindow, {
        filters: [
          {
            name: 'XLSX File',
            extensions: ['xlsx'],
          },
          {
            name: 'CSV File',
            extensions: ['csv'],
          },
        ],
        properties: ['openFile'],
      });
      const dir: string | undefined = filePaths[0];
      if (dir) {
        await initialize(dir);
        // eslint-disable-next-line consistent-return
        return getSheets();
      }
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.handle('configure-phone', async (_, config: PhoneClientConfig) => {
    const mainWindow = getMainWindow();
    const sheet = getWorkBook().getSheet(config.sheetName);
    if (!sheet.uniqueHeaders)
      return {
        err: 'Sheet headers are not unique make sure that the header value are unique then try again.',
      };
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      filters: [
        {
          name: 'XLSX File',
          extensions: ['xlsx'],
        },
        {
          name: 'CSV File',
          extensions: ['csv'],
        },
      ],
    });

    if (filePath === '' || filePath === undefined)
      return {
        err: 'You must choose a save location',
      };

    configure({
      ...config,
      savePath: filePath,
    });
    return changePhones();
  });
};
