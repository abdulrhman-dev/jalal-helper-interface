/* eslint-disable radix */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */
import * as XLSX from 'xlsx';
import WorkSheet from './WorkSheet';

export const ec = (r, c) => {
  return XLSX.utils.encode_cell({ r, c });
};

export const deleteRowUtility = (ws, rowIndex) => {
  return new Promise((resolve) => {
    const range = XLSX.utils.decode_range(ws['!ref']);
    // eslint-disable-next-line no-plusplus
    for (let R = rowIndex; R <= range.e.r; ++R) {
      // eslint-disable-next-line no-plusplus
      for (let C = range.s.c; C <= range.e.c; ++C) {
        ws[ec(R, C)] = ws[ec(R + 1, C)];
      }
    }
    // eslint-disable-next-line no-plusplus
    range.e.r--;
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e);
    resolve('');
  });
};

export const getType = (value) => {
  switch (value) {
    case typeof value === 'string':
      return 's';
    case typeof value === 'boolean':
      return 'b';
    case typeof value === 'number':
      return 'n';
    default:
      return 's';
  }
};

// عك انا مش عارف ايه بيجصل هنا بس بيشتغل
export function findDuplicats(array: ColumnItem[]) {
  const workArray = array.map((item) => item.value);
  const duplicatesObject: object = {};
  const yourArrayWithoutDuplicates = [...new Set(workArray)];

  let duplicates = array;
  yourArrayWithoutDuplicates.forEach((item) => {
    const i = duplicates.findIndex((columnItem) => columnItem.value === item);

    duplicatesObject[String(item)] = [duplicates[i]];

    duplicates = duplicates
      .slice(0, i)
      .concat(duplicates.slice(i + 1, duplicates.length));
  });

  duplicates.forEach((duplict) => {
    const key = String(duplict.value);
    if (duplicatesObject[key] === undefined) {
      duplicatesObject[key] = [duplict];
      return;
    }
    duplicatesObject[key].push(duplict);
  });

  Object.keys(duplicatesObject).forEach((key) => {
    if (duplicatesObject[key].length === 1) delete duplicatesObject[key];
  });

  return duplicatesObject;
}

function shift(index: number, arr: number[]) {
  const shiftAmount = arr.reduce((acc, curr) => {
    if (curr < index) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return shiftAmount;
}

export function updateDuplicates(
  duplicateObject: object,
  currentIndex: number,
  indexArr: number[]
) {
  const keys = Object.keys(duplicateObject);
  const duplicateObjectLength = keys.length;

  for (let i = currentIndex; i < duplicateObjectLength; i++) {
    duplicateObject[keys[i]].map((item) => {
      const shiftAmount = shift(item.index, indexArr);
      item.index -= shiftAmount;

      return item;
    });
  }

  return duplicateObject;
}

function searchAndDeploy(
  sheet: WorkSheet,
  key: string,
  value: XlsxAcceptedTypes,
  mainIndex: number
) {
  const currHeaderIndex = sheet.getHeaderIndex(key);
  const prevHeader = sheet.getHeaderAtIndex(currHeaderIndex - 1);
  const nextHeader = sheet.getHeaderAtIndex(currHeaderIndex + 1);

  const isOccupied = sheet.isOccupied(
    ec(mainIndex + sheet.headerIndex + 1, nextHeader?.position.c)
  );

  const [currHeaderName, currHeaderNumber = '1'] = key.split('_');

  if (nextHeader === undefined) {
    const newHeaderName = [currHeaderName, parseInt(currHeaderNumber) + 1].join(
      '_'
    );
    sheet.pushHeader(newHeaderName);
    sheet.set(newHeaderName, value, mainIndex);
    return;
  }

  const [nextHeaderName] = nextHeader.key.split('_');

  if (!isOccupied) {
    if (nextHeaderName === currHeaderName) {
      sheet.set(nextHeader?.key, value, mainIndex);
      return;
    }

    const newHeaderName = [currHeaderName, parseInt(currHeaderNumber) + 1].join(
      '_'
    );
    sheet.shiftColumn(currHeaderIndex + 1, 1);
    sheet.setHeader(
      [currHeaderName, parseInt(currHeaderNumber) + 1].join('_'),
      currHeaderIndex + 1
    );
    sheet.set(newHeaderName, value, mainIndex);
    return;
  }

  if (nextHeaderName === currHeaderName) {
    searchAndDeploy(sheet, nextHeader.key, value, mainIndex);
    return;
  }

  if (prevHeader?.key === undefined) return;

  const [prevHeaderName] = prevHeader.key.split('_');

  if (prevHeaderName === currHeaderName) {
    const newHeaderName = [currHeaderName, parseInt(currHeaderNumber) + 1].join(
      '_'
    );
    sheet.shiftColumn(currHeaderIndex + 1, 1);
    sheet.setHeader(
      [currHeaderName, parseInt(currHeaderNumber) + 1].join('_'),
      currHeaderIndex + 1
    );
    sheet.set(newHeaderName, value, mainIndex);
  }
}

export function updateMergeTarget(
  sheet: WorkSheet,
  rows: ColumnItem[][],
  main: ColumnItem[]
) {
  const mainIndex = main[0].index;

  for (let R = 0; R < rows.length; R++) {
    const row = rows[R];
    if (row.length === 2) continue;

    for (let C = 2; C < row.length; C++) {
      const column = row[C];
      if (!column.key) continue;

      const mainTarget = sheet.getRow(mainIndex);
      const exists = mainTarget.find(
        (mainColumn) => mainColumn.key === column.key
      );

      if (!exists) {
        sheet.set(column.key, column.value, mainIndex);
        continue;
      }

      if (exists?.value === column.value) continue;

      // search and deploy
      searchAndDeploy(sheet, column.key, column.value, mainIndex);
    }
  }
}
