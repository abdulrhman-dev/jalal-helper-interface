import { useState } from 'react';
import { Button, Stack } from '@mantine/core';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  async function getData() {
    const wbSheets: ClientSheet[] =
      await window.electron.ipcRenderer.invokeAsync<ClientSheet[]>(
        'get-data-duplicate'
      );

    if (!wbSheets) return;

    setSheets(wbSheets);
  }

  function goBack() {
    setSheets([]);
  }

  return (
    <div className="container">
      {sheets.length > 0 ? (
        <ConfigureSheet sheets={sheets} goBack={() => goBack()} />
      ) : (
        <Stack>
          <SelectButton getData={() => getData()} />
          <Button variant="light" onClick={() => navigate('/')}>
            Go back
          </Button>
        </Stack>
      )}
    </div>
  );
}
