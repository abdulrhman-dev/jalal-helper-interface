import { useEffect, useState, useCallback } from 'react';
import { Stack, SegmentedControl, Select, Button } from '@mantine/core';
import SettingsIcon from '@mui/icons-material/Settings';

export default function ConfigureSheet({ sheets }: { sheets: ClientSheet[] }) {
  const [choosenSheet, setChoosenSheet] = useState('');
  const [duplicateChoices, setDuplicateChoices] = useState([]);
  const [duplicateTarget, setDuplicateTarget] = useState('');
  const [identifierChoices, setIdentifierChoices] = useState([]);
  const [identifier, setIdentifier] = useState('');

  const configure = useCallback(
    (index: number) => {
      setChoosenSheet(sheets[index].name);
      const headersArr = sheets[index].headers.map((header) => ({
        label: header.key,
        value: header.key,
      }));
      const filterd = headersArr.filter(
        (choice) => choice.value !== headersArr[0].value
      );

      setDuplicateChoices(headersArr);
      setDuplicateTarget(headersArr[0].value);
      setIdentifierChoices(filterd);
      setIdentifier(headersArr[1].value);
    },
    [sheets]
  );

  useEffect(() => {
    configure(0);
  }, [sheets, configure]);

  useEffect(() => {
    if (choosenSheet === '') return;
    const index = sheets.findIndex((sheet) => sheet.name === choosenSheet);
    configure(index);
  }, [choosenSheet, sheets, configure]);

  const handleChangeDuplicate = (event) => {
    const filterd = duplicateChoices.filter((choice) => choice.value !== event);
    setIdentifierChoices(filterd);
    setIdentifier(filterd[0].value);
    setDuplicateTarget(event);
  };

  const configureXLSXfile = async () => {
    const duplicateObj = await window.electron.ipcRenderer.invokeAsync(
      'configure',
      {
        duplicateKey: duplicateTarget,
        identifierKey: identifier,
        sheetName: choosenSheet,
      }
    );

    const duplicateObj2 = await window.electron.ipcRenderer.invokeAsync(
      'delete-duplicate',
      0
    );
    console.log(duplicateObj, duplicateObj2);
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
      <Select
        label="Choose the duplicate target"
        placeholder="Pick one"
        value={duplicateTarget}
        onChange={handleChangeDuplicate}
        data={duplicateChoices}
      />
      <Select
        label="Choose the identifier"
        placeholder="Pick one"
        value={identifier}
        onChange={setIdentifier}
        data={identifierChoices}
      />
      <Button
        leftIcon={<SettingsIcon fontSize="small" />}
        onClick={() => configureXLSXfile()}
      >
        Configure
      </Button>
    </Stack>
  );
}
