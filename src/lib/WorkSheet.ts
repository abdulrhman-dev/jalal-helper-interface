/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import * as XLSX from 'xlsx';
import { deleteRowUtility, getType } from './utilities';

class WorkSheet {
  private _sheet: XLSX.WorkSheet;

  name: string;

  data: XLSX.WorkSheet;

  headerIndex: number;

  headers: Header[];

  uniqueHeaders: boolean;

  constructor(sheetName: string, workbook: XLSX.WorkBook, headerIndex = 0) {
    const sheet = workbook.Sheets[sheetName];
    this._sheet = sheet;
    this.data = sheet;
    this.uniqueHeaders = true;
    this.headerIndex = headerIndex;
    this.name = sheetName;
    this.headers = this.setHeaders();
  }

  async deleteRow(rowIndex: number) {
    await deleteRowUtility(this._sheet, rowIndex + this.headerIndex + 1);
  }

  toJson(options?: XLSX.Sheet2JSONOpts) {
    return XLSX.utils.sheet_to_json(this._sheet, options);
  }

  insertJsonData(data: any[], options?: XLSX.SheetJSONOpts) {
    XLSX.utils.sheet_add_json(this._sheet, data, options);
  }

  cellInRange(cellName: string) {
    if (!this._sheet['!ref']) throw new Error('ref for sheet was not found');
    const range = XLSX.utils.decode_range(this._sheet['!ref']);
    const cell = XLSX.utils.decode_cell(cellName);

    // check if in row range
    if (range.e.r < cell.r) return false;

    // check if in column range
    if (range.e.c < cell.c) return false;

    return true;
  }

  insertCell(cellName: string, data: XLSX.CellObject) {
    if (!this._sheet['!ref']) throw new Error('ref for sheet was not found');

    if (this.cellInRange(cellName)) {
      const cell = this._sheet[cellName];

      this._sheet[cellName] = {
        ...cell,
        ...data,
      };

      return;
    }

    this.updateRange(cellName);
    this._sheet[cellName] = data;
  }

  updateRange(cellName: string) {
    if (!this._sheet['!ref']) throw new Error('ref for sheet was not found');
    if (this.cellInRange(cellName)) return;

    const cell = XLSX.utils.decode_cell(cellName);
    const range = XLSX.utils.decode_range(this._sheet['!ref']);

    if (cell.c > range.e.c) {
      range.e.c = cell.c;
    }

    if (cell.r > range.e.r) {
      range.e.r = cell.r;
    }

    this.headers = this.setHeaders();
    this._sheet['!ref'] = XLSX.utils.encode_range({ s: range.s, e: range.e });
  }

  isOccupied(cellName: string) {
    return this._sheet[cellName] !== undefined;
  }

  setHeaders() {
    if (!this._sheet['!ref']) throw new Error('ref for sheet was not found');
    const range = XLSX.utils.decode_range(this._sheet['!ref']);
    const headerRange: XLSX.Range = {
      s: { c: 0, r: this.headerIndex },
      e: { c: range.e.c, r: this.headerIndex },
    };

    const headers: Header[] = [];

    for (let i = headerRange.s.c; i <= headerRange.e.c; i++) {
      const cellPosition = { c: i, r: this.headerIndex };
      const cellName = XLSX.utils.encode_cell(cellPosition);
      // eslint-disable-next-line no-continue
      if (!this.isOccupied(cellName)) continue;

      const cell = this._sheet[cellName];

      // check if it exists
      if (this.uniqueHeaders && headers.find((header) => header.key === cell.v))
        this.uniqueHeaders = false;

      headers.push({
        data: cell,
        position: cellPosition,
        key: cell.v,
      });
    }

    return headers;
  }

  pushHeader(value: string) {
    if (this.headers.find((header) => header.key === value))
      throw new Error('header already exists');

    const position = { c: this.headers.length, r: this.headerIndex };
    const cell = XLSX.utils.encode_cell(position);

    this.insertCell(cell, {
      t: 's',
      v: value,
    });

    this.headers.push({
      key: value,
      position,
      data: {
        t: 's',
        v: value,
      },
    });
  }

  setHeader(value: string, column: number) {
    const match = this.headers.find(
      (header, index) => header.key === value && index !== column
    );
    if (match) throw new Error('header already exists');

    const position = { c: column, r: this.headerIndex };
    const cell = XLSX.utils.encode_cell(position);
    this.insertCell(cell, { t: 's', v: value });

    const header: Header = {
      key: value,
      position,
      data: { t: 's', v: value },
    };

    if (column < this.headers.length) {
      this.headers[column] = header;
      return;
    }

    this.headers.push(header);
  }

  set(key: string, value: XlsxAcceptedTypes, rowIndex: number) {
    rowIndex = this.headerIndex + 1 + rowIndex;
    if (!this.uniqueHeaders)
      throw new Error('Header must be unique to use this method');
    const header = this.headers.find((headerItem) => headerItem.key === key);
    if (!header) throw new Error('Passed key is not in the headers');

    const cell = XLSX.utils.encode_cell({ c: header.position.c, r: rowIndex });

    this.insertCell(cell, {
      t: getType(value),
      v: value,
    });
  }

  get(key: string, rowIndex: number) {
    rowIndex = this.headerIndex + 1 + rowIndex;
    if (!this.uniqueHeaders)
      throw new Error('Header must be unique to use this method');
    const header = this.headers.find((headerItem) => headerItem.key === key);
    if (!header) throw new Error('Passed key is not in the headers');

    const cell = XLSX.utils.encode_cell({ c: header.position.c, r: rowIndex });

    if (!this._sheet[cell]) return '';
    return this._sheet[cell].v;
  }

  remove(key: string, rowIndex: number) {
    rowIndex = this.headerIndex + 1 + rowIndex;
    if (!this.uniqueHeaders)
      throw new Error('Header must be unique to use this method');
    const header = this.headers.find((headerItem) => headerItem.key === key);
    if (!header) throw new Error('Passed key is not in the headers');

    const cell = XLSX.utils.encode_cell({ c: header.position.c, r: rowIndex });

    this._sheet[cell] = undefined;
  }

  getColumn(key: string, ignoreEmpty = true) {
    if (!this.uniqueHeaders)
      throw new Error('Header must be unique to use this method');
    const header = this.headers.find((headerItem) => headerItem.key === key);
    if (!header) throw new Error('Passed key is not in the headers');

    const startingRow = this.headerIndex + 1;

    const data: ColumnItem[] = [];

    for (let i = 0; i < this.dataRowNumber; i++) {
      const cell = XLSX.utils.encode_cell({
        c: header.position.c,
        r: i + startingRow,
      });

      if (!this._sheet[cell]) {
        // eslint-disable-next-line no-continue
        if (ignoreEmpty) continue;

        this._sheet[cell] = { v: null };
      }

      data.push({
        key: header.key,
        value: this._sheet[cell].v,
        index: i,
      });
    }

    return data;
  }

  get dataRowNumber() {
    if (!this._sheet['!ref']) throw new Error('ref for sheet was not found');
    const range = XLSX.utils.decode_range(this._sheet['!ref']);
    return range.e.r - this.headerIndex;
  }
}

export default WorkSheet;
