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

const getClientObject = (index: number) => {
  const sheet = workbook.getSheet(config.sheetName);
  const keys = Object.keys(duplicateObject);

  return duplicateObject[keys[index]].map((item) => ({
    [config.identifierKey]: sheet.get(config.identifierKey, item.index),
    // TODO: THIS IS TEMP
    [config.duplicateKey]: sheet.get(config.duplicateKey, item.index),
    row: item.index + sheet.headerIndex + 2,
  }));
};

export const getDuplicateObject = (): object => {
  if (!config) return {};
  if (!workbook) return {};
  const sheet = workbook.getSheet(config.sheetName);

  duplicateObject = findDuplicats(sheet.getColumn(config.duplicateKey));

  const keys = Object.keys(duplicateObject);

  if (keys.length === 0) return [];

  return { object: getClientObject(0), total: keys.length };
};

export const deleteSingleDuplicate = (currentIndex: number) => {
  if (Object.keys(duplicateObject).length === 0) return {};

  duplicateObject = deleteDuplicates(
    duplicateObject,
    currentIndex,
    workbook,
    workbook.getSheet(config.sheetName)
  );

  return { object: getClientObject(currentIndex + 1) };
};

export function excute() {}
