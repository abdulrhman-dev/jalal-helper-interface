import { useState } from 'react';
import { Button, Stack, Alert } from '@mantine/core';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ConfigureSheet from './DuplicateConfigureSheet';

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

export default function ConfigurePage() {
  const [sheets, setSheets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function getData() {
    type ReturnType = ClientSheet[] | { err: string };

    const wbSheets: ReturnType =
      await window.electron.ipcRenderer.invokeAsync<ReturnType>(
        'initialize-duplicate'
      );

    if (!wbSheets) return;

    setError('');

    if (!Array.isArray(wbSheets)) {
      if (wbSheets.err) setError(wbSheets.err);
    } else setSheets(wbSheets);
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
          {error !== '' && (
            <Alert
              sx={{ width: 250 }}
              icon={<ErrorOutlineIcon fontSize="small" />}
              title="An error occured!"
              color="red"
            >
              {error}
            </Alert>
          )}
          <SelectButton getData={() => getData()} />
          <Button variant="light" onClick={() => navigate('/')}>
            Go back
          </Button>
        </Stack>
      )}
    </div>
  );
}
