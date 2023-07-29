/* eslint-disable no-plusplus */
/* eslint-disable import/no-cycle */
import { ipcMain, dialog } from 'electron';
import {
  configure,
  deleteSingleDuplicate,
  getDuplicateObject,
  getSheets,
  getWorkBook,
  initialize,
  skipSingleDuplicate,
} from '../tools/duplicate';
import { getMainWindow } from '../main';

export default () => {
  ipcMain.handle('initialize-duplicate', async () => {
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

        const workbookSheets = getSheets();

        for (let i = 0; i < workbookSheets.length; i++) {
          const sheet = workbookSheets[i];

          // eslint-disable-next-line consistent-return
          if (sheet.headers.length > 1) return workbookSheets;
        }

        // eslint-disable-next-line consistent-return
        return {
          err: 'To use this tool you need to have at least two headers',
        };
      }
    } catch (err) {
      // eslint-disable-next-line consistent-return
      console.log(err);
    }
  });

  ipcMain.handle(
    'configure-duplicate',
    async (_, config: DuplicateClientConfig) => {
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
        filePath,
      });

      const duplicateObject = getDuplicateObject();

      if (duplicateObject.object.length === 0)
        return {
          err: 'There is no duplicates in this sheet',
        };

      return duplicateObject;
    }
  );

  ipcMain.handle('delete-duplicate', (_, res: any) => {
    try {
      return deleteSingleDuplicate(res.index, res.newIdentfier);
    } catch (err) {
      return { err: err.message };
    }
  });

  ipcMain.handle('skip-duplicate', (_, index: number) => {
    try {
      return skipSingleDuplicate(index);
    } catch (err) {
      return { err: err.message };
    }
  });
};
