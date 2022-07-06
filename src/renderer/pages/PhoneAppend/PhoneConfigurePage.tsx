import { useState } from 'react';
import { Button, Stack } from '@mantine/core';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
import PhoneConfigureSheet from './PhoneConfigureSheet';

function SelectButton({ getData }: { getData: CallableFunction }) {
  return (
    <Button
      leftIcon={<InsertDriveFileIcon fontSize="small" />}
      onClick={() => getData()}
    >
      Choose an <span className="bolded">XLSX/CSV</span> file
    </Button>
  );
}

export default function PhoneConfigurePage() {
  const [sheets, setSheets] = useState([]);
  const navigate = useNavigate();

  async function getData() {
    const wbSheets: ClientSheet[] =
      await window.electron.ipcRenderer.invokeAsync<ClientSheet[]>(
        'initialize-phone'
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
        <PhoneConfigureSheet goBack={() => goBack()} sheets={sheets} />
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
