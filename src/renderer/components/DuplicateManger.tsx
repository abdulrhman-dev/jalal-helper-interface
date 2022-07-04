import { Stack, Table, Progress, Button, Autocomplete } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDuplicate,
  useSetDuplicate,
} from 'renderer/providers/DuplicateProvider';

export default function DuplicateManger() {
  const { duplicate, currentIndex, total } = useDuplicate();
  const [identifierState, setIdentifierState] = useState({
    list: [],
    value: '',
    error: '',
  });
  const setDuplicate = useSetDuplicate();
  const navigate = useNavigate();

  useEffect(() => {
    if (duplicate.length === 0) navigate('/configure', { replace: true });
    else {
      const keys = Object.keys(duplicate[0]);

      const identifierList = [
        ...new Set(duplicate.map((item) => item[keys[0]])),
      ];

      setIdentifierState({
        error: '',
        value: '',
        list: identifierList,
      });
    }
  }, [duplicate, navigate]);

  if (duplicate.length !== 0) {
    const keys = Object.keys(duplicate[0]);

    const header = keys.map((headerKey) => (
      <th key={headerKey}>{headerKey}</th>
    ));

    const rows = duplicate.map((item) => (
      <tr key={item.row}>
        {keys.map((key) => (
          <td key={String(Symbol(key))}>{item[key]}</td>
        ))}
      </tr>
    ));

    const handleSkipDuplicate = async () => {
      const result = await window.electron.ipcRenderer.invokeAsync<{
        object: object | undefined;
      }>('skip-duplicate', currentIndex);

      if (result.object === undefined)
        navigate('/configure', { replace: true });

      setDuplicate({
        duplicate: result.object,
        currentIndex: currentIndex + 1,
        total,
      });
    };

    const handleMergeDuplicate = async () => {
      if (identifierState.value === '') {
        setIdentifierState({
          ...identifierState,
          error: 'you must enter an identifier to continue',
        });
        return;
      }

      const result = await window.electron.ipcRenderer.invokeAsync<{
        object: object | undefined;
      }>('delete-duplicate', {
        index: currentIndex,
        newIdentfier: identifierState.value,
      });

      if (result.object === undefined)
        navigate('/configure', { replace: true });

      setDuplicate({
        duplicate: result.object,
        currentIndex: currentIndex + 1,
        total,
      });
    };

    return (
      <div className="container">
        <Stack sx={{ minWidth: 400 }}>
          <div>
            <Progress
              radius="xs"
              size="lg"
              value={((currentIndex + 1) / total) * 100}
            />
          </div>
          <Table>
            <thead>
              <tr>{header}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Autocomplete
            error={identifierState.error !== '' ? identifierState.error : null}
            label="New Merge identifier..."
            placeholder="Start typeing your identifier"
            value={identifierState.value}
            onChange={(e) =>
              setIdentifierState({ ...identifierState, value: e })
            }
            data={identifierState.list}
          />
          <Button onClick={handleMergeDuplicate}>Merge</Button>
          <Button onClick={handleSkipDuplicate} variant="light">
            Skip
          </Button>
        </Stack>
      </div>
    );
  }
}
