/* eslint-disable prettier/prettier */
import * as XLSX from 'xlsx';

declare global {
  type XlsxAcceptedTypes = string | number | boolean;

  interface Header {
    key: string;
    position: XLSX.CellAddress;
    data: XLSX.CellObject;
  }

  interface ColumnItem {
    value: XlsxAcceptedTypes;
    index: number;
    key: string | undefined;
  }

  interface ClientSheet {
    name: string;
    headers: Header[];
  }

  interface DuplicateClientConfig {
    sheetName: string;
    duplicateKey: string;
    identifierKey: string;
    filePath: string | undefined;
    mergeAll: boolean;
  }

  interface PhoneClientConfig {
    sheetName: string;
    phoneTarget: string;
    savePath: string;
  }

  interface PreventedPhones {
    number: string;
    index: number;
  }

  interface DuplicateState {
    duplicate: any[];
    currentIndex: number;
    total: number;
    finishedDuplicate: any[];
  }

  interface PhoneState {
    phoneResult: PreventedPhones[];
  }

  type CallbackFunction = () => void;
}
