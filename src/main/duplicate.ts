/* eslint-disable prettier/prettier */
import WorkBook from '../lib/WorkBook';
import {
  updateDuplicates,
  findDuplicats,
  updateMergeTarget,
} from '../lib/utilities';

let workbook: WorkBook | undefined;
let duplicateObject: object;
let config: ClientConfig;

export const initialize = (dir: string) => {
  workbook = new WorkBook(dir, {
    cellStyles: true,
    cellText: true,
    codepage: 65001,
  });
};

export const getWorkBook = () => {
  return workbook;
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

export const getDuplicateObject = () => {
  if (!config) return { object: [] };
  if (!workbook) return { object: [] };
  const sheet = workbook.getSheet(config.sheetName);

  duplicateObject = findDuplicats(sheet.getColumn(config.duplicateKey));

  const keys = Object.keys(duplicateObject);

  if (keys.length === 0) return { object: [] };

  return { object: getClientObject(0), total: keys.length };
};

export function deleteDuplicates(currentIndex: number, newIdentfier: string) {
  const identfierKey = config.identifierKey;
  const sheet = workbook.getSheet(config.sheetName);
  const keys = Object.keys(duplicateObject);
  const duplicates: ColumnItem[] = duplicateObject[keys[currentIndex]];
  const indexArr: number[] = [];
  const first = duplicates[0];

  let shiftAmount = 0;

  const rows: any = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < duplicates.length; i++) {
    // eslint-disable-next-line prefer-destructuring
    const index = duplicates[i].index - shiftAmount;
    rows.push(sheet.getRow(index));
    sheet.deleteRow(index);
    // eslint-disable-next-line no-plusplus
    shiftAmount++;
    indexArr.push(duplicates[i].index);
  }

  sheet.set(identfierKey, newIdentfier, first.index);
  if (config.mergeAll) {
    try {
      console.log(sheet.headers.map((header) => header.key));
      updateMergeTarget(sheet, rows, sheet.getRow(first.index));
      console.log(sheet.headers.map((header) => header.key));
    } catch (err) {
      console.log(err?.message);
    }
  }
  workbook.save(config.filePath);
  if (keys.length === currentIndex + 1) return duplicateObject;

  return updateDuplicates(duplicateObject, currentIndex + 1, indexArr);
}

export const deleteSingleDuplicate = (
  currentIndex: number,
  newIdentfier: string
) => {
  const keys = Object.keys(duplicateObject);
  if (keys.length === 0) return { object: [] };

  duplicateObject = deleteDuplicates(currentIndex, newIdentfier);

  if (currentIndex + 1 >= keys.length) {
    return { object: [] };
  }
  return { object: getClientObject(currentIndex + 1) };
};

export const skipSingleDuplicate = (currentIndex: number) => {
  const keys = Object.keys(duplicateObject);
  if (keys.length === 0 || keys.length - 1 <= currentIndex)
    return { object: [] };

  return { object: getClientObject(currentIndex + 1) };
};

export function excute() {}
