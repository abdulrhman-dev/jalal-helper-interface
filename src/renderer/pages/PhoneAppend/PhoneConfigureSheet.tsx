import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  SegmentedControl,
  Button,
  MultiSelect,
  Alert,
} from '@mantine/core';
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
  const [targetHeaders, setTargetHeaders] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (choosenSheet !== '') {
      const sheetHeaders = sheets
        .find((sheet) => sheet.name === choosenSheet)
        .headers.map((header) => header.key);
      setHeaders(sheetHeaders);
    }
  }, [sheets, choosenSheet]);

  const exportFile = async () => {
    if (targetHeaders.length === 0) return;

    type Result = PreventedPhones[] | { err: string };
    const result = await window.electron.ipcRenderer.invokeAsync<Result>(
      'configure-phone',
      {
        sheetName: choosenSheet,
        phoneTargets: targetHeaders,
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
      <MultiSelect
        data={headers}
        label="Choose Phone Header to add country code"
        placeholder="Pick all that you like"
        value={targetHeaders}
        onChange={(value) => setTargetHeaders(value)}
        clearButtonLabel="Clear selection"
        clearable
        sx={{ width: 300 }}
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
