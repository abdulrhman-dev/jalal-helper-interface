/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import * as XLSX from 'xlsx';
import fs from 'fs/promises';

// eslint-disable-next-line import/no-cycle
import WorkSheet from './WorkSheet';

class Workbook {
  private _workbook: XLSX.WorkBook;

  filename: string | undefined;

  Sheets: { [sheet: string]: XLSX.WorkSheet };

  SheetNames: string[];

  Props?: XLSX.FullProperties;

  Custprops?: object;

  vbaraw?: unknown;

  constructor(filename?: string, options?: XLSX.ParsingOptions) {
    if (filename) {
      this.filename = filename;
    } else {
      this._workbook = XLSX.utils.book_new();

      this.Sheets = this._workbook.Sheets;
      this.SheetNames = this._workbook.SheetNames;
      this.Props = this._workbook.Props;
      this.Custprops = this._workbook.Custprops;
      this.vbaraw = this._workbook.vbaraw;
    }
  }

  async initFile() {
    const data = await fs.readFile(this.filename, 'base64');

    this._workbook = await XLSX.read(data);

    this.Sheets = this._workbook.Sheets;
    this.SheetNames = this._workbook.SheetNames;
    this.Props = this._workbook.Props;
    this.Custprops = this._workbook.Custprops;
    this.vbaraw = this._workbook.vbaraw;
  }

  getSheet(sheetName: string, headerIndex?: number): WorkSheet {
    return new WorkSheet(sheetName, this._workbook, headerIndex);
  }

  getSheets(headerIndex?: number): WorkSheet[] {
    const sheets: WorkSheet[] = [];

    this._workbook.SheetNames.forEach((sheetName) => {
      try {
        const sheet = new WorkSheet(sheetName, this._workbook, headerIndex);

        sheets.push(sheet);
      } catch (err) {
        console.log(err);
      }

      return 0;
    });

    return sheets;
  }

  createSheet(sheetName: string, roll?: boolean) {
    XLSX.utils.book_append_sheet(
      this._workbook,
      { '!ref': 'A1:A1' },
      sheetName,
      roll
    );
    return this.getSheet(sheetName);
  }

  save(
    directory: string | undefined = this.filename,
    options?: XLSX.WritingOptions
  ) {
    if (!directory) throw new Error('No filename was found');
    XLSX.writeFile(this._workbook, directory, options);
  }
}

export default Workbook;
