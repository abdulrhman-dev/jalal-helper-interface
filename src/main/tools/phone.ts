import WorkBook from '../lib/WorkBook';

let workbook: WorkBook | undefined;
let config: object;

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

export const configure = (value: DuplicateClientConfig) => {
  config = value;
};
