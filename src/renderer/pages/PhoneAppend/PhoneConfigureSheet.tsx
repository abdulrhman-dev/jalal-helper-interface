import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  SegmentedControl,
  Select,
  Button,
  Checkbox,
  Alert,
} from '@mantine/core';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSetDuplicate } from 'renderer/providers/DuplicateProvider';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSetPhone } from 'renderer/providers/PhoneProvider';

export default function PhoneConfigureSheet({
  sheets,
  goBack,
}: {
  sheets: ClientSheet[];
  goBack: CallableFunction;
}) {
  const navigate = useNavigate();
  const setPhone = useSetPhone();
  const [choosenSheet, setChoosenSheet] = useState(sheets[0].name);
  const [targetHeader, setTargetHeader] = useState('');
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (choosenSheet !== '') {
      const sheetHeaders = sheets
        .find((sheet) => sheet.name === choosenSheet)
        .headers.map((header) => header.key);
      setHeaders(sheetHeaders);
      setTargetHeader(sheetHeaders[0]);
    }
  }, [sheets, choosenSheet]);

  const exportFile = async () => {
    type Result = PreventedPhones[] | { err: string };

    const result = await window.electron.ipcRenderer.invokeAsync<Result>(
      'configure-phone',
      {
        sheetName: choosenSheet,
        phoneTarget: targetHeader,
      }
    );

    if (!Array.isArray(result)) {
      if (result.err) setError(result.err);
      return;
    }

    setError('');
    setPhone({ phoneResult: result });
    navigate('/phone/success');
  };
  return (
    <Stack sx={{ minWidth: 250 }}>
      <SegmentedControl
        value={choosenSheet}
        onChange={setChoosenSheet}
        data={sheets.map((sheet) => ({
          label: sheet.name,
          value: sheet.name,
        }))}
      />
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
      <Select
        label="Choose Phone Header to add country code"
        placeholder="Pick one"
        value={targetHeader}
        onChange={setTargetHeader}
        data={headers}
      />
      <Button
        leftIcon={<InsertDriveFileIcon fontSize="small" />}
        onClick={() => exportFile()}
      >
        Export File
      </Button>
      <Button variant="light" onClick={() => goBack()}>
        Go Back
      </Button>
    </Stack>
  );
}
