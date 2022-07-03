import { useState } from 'react';
import { Button } from '@mantine/core';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ConfigureSheet from './ConfigureSheet';

function SelectButton({ getData }: { getData: CallableFunction }) {
  return (
    <Button
      leftIcon={<InsertDriveFileIcon fontSize="small" />}
      onClick={() => getData()}
    >
      Choose an <span className="bolded">XLSX</span> file
    </Button>
  );
}

export default function ConfigurePage() {
  const [sheets, setSheets] = useState([]);

  async function getData() {
    const wbSheets: ClientSheet[] =
      await window.electron.ipcRenderer.invokeAsync<ClientSheet[]>(
        'get-data-xlsx'
      );

    if (!wbSheets) return;

    setSheets(wbSheets);
  }

  return (
    <div className="container">
      {sheets.length > 0 ? (
        <ConfigureSheet sheets={sheets} />
      ) : (
        <SelectButton getData={() => getData()} />
      )}
    </div>
  );
}
