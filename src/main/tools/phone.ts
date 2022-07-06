/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import WorkBook from '../lib/WorkBook';

let workbook: WorkBook | undefined;
let config: PhoneClientConfig;

export const initialize = (dir: string) => {
  workbook = new WorkBook(dir, {
    cellStyles: true,
    cellText: true,
    codepage: 65001,
  });
};

export const getSheets = () => {
  const sheets = workbook.getSheets();

  return sheets.map((sheet) => ({ name: sheet.name, headers: sheet.headers }));
};

export const configure = (value: PhoneClientConfig) => {
  config = value;
};

export const getWorkBook = () => {
  return workbook;
};

export function changePhone(): PreventedPhones[] {
  const result: PreventedPhones[] = [];
  const sheet = workbook.getSheet(config.sheetName);

  const phoneRegex = new RegExp(
    /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
  );

  for (let i = 0; i < sheet.dataRowNumber; i++) {
    const value = sheet.get(config.phoneTarget, i);

    if (!value) continue;

    let numbers = String(value).split(' ::: ');

    numbers = numbers.map((number) =>
      number.split(' ').join('').split('-').join('')
    );

    let passed = 0;

    const originalNumbers = numbers.join('-');

    for (let j = 0; j < numbers.length; j++) {
      const number = numbers[j];
      if (phoneRegex.test(number)) passed += 1;
    }

    if (passed === numbers.length) {
      numbers = numbers.map((number) => {
        const match = number.match(phoneRegex);
        if (match === null) return number;

        const code = match[1];

        if (code === undefined && number.length === 10) {
          return `+20${number}`;
        }

        switch (code) {
          case '0':
            return `+20${number.substring(1)}`;
          case '20':
            if (!number.startsWith('+')) return `+${number}`;
            return number;
          case '2':
            return `+${number}`;
          default:
            return number;
        }
      });

      const newNumbers = numbers.join(' ::: ');
      sheet.set(config.phoneTarget, newNumbers, i);
      continue;
    }

    result.push({
      number: originalNumbers,
      index: i + 1 + sheet.headerIndex,
    });
  }

  workbook.save(config.savePath);

  return result;
}
