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
        initialize(dir);

        // eslint-disable-next-line consistent-return
        return getSheets();
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

      let { filePath } = await dialog.showSaveDialog(mainWindow, {
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

      if (filePath === '') filePath = undefined;

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
    return deleteSingleDuplicate(res.index, res.newIdentfier);
  });

  ipcMain.handle('skip-duplicate', (_, index: number) => {
    return skipSingleDuplicate(index);
  });
};
