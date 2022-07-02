/* eslint-disable prettier/prettier */
import WorkBook from '../lib/WorkBook';
import { deleteDuplicates, findDuplicats } from '../lib/utilities';

let workbook: WorkBook | undefined;
let duplicateObject: object;
let config: ClientConfig;

export const initialize = (dir: string) => {
  workbook = new WorkBook(dir);
};

export const getSheets = (): ClientSheet[] => {
  const sheets = workbook.getSheets();

  return sheets.map((sheet) => ({ name: sheet.name, headers: sheet.headers }));
};

export const configure = (value: ClientConfig) => {
  config = value;
};

export const getDuplicateObject = (): object => {
  if (!config) return {};
  if (!workbook) return {};
  duplicateObject = findDuplicats(
    workbook.getSheet(config.sheetName).getColumn(config.duplicateKey)
  );

  return duplicateObject;
};

export const deleteSingleDuplicate = (currentIndex: number) => {
  if (Object.keys(duplicateObject).length === 0) return {};

  duplicateObject = deleteDuplicates(
    duplicateObject,
    currentIndex,
    workbook,
    workbook.getSheet(config.sheetName)
  );

  return duplicateObject;
};

export function excute() {}
