import {
  Stack,
  Table,
  Progress,
  Button,
  Autocomplete,
  Checkbox,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDuplicate,
  useSetDuplicate,
} from 'renderer/providers/DuplicateProvider';
import CloseIcon from '@mui/icons-material/Close';

export default function DuplicateManger() {
  const { duplicate, currentIndex, total, finishedDuplicate } = useDuplicate();
  const [identifierState, setIdentifierState] = useState({
    list: [],
    value: '',
    error: '',
  });
  const [plugDefault, setPlugDefault] = useState(false);
  const setDuplicate = useSetDuplicate();
  const navigate = useNavigate();

  useEffect(() => {
    if (duplicate.length === 0)
      navigate('/duplicate/configure', { replace: true });
    else {
      const keys = Object.keys(duplicate[0]);

      const identifierList = [
        ...new Set(duplicate.map((item) => item[keys[0]])),
      ];

      setIdentifierState({
        error: '',
        value: plugDefault ? identifierList[0] : '',
        list: identifierList,
      });
    }
  }, [duplicate, navigate, plugDefault]);

  const handlePlugDefaultChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlugDefault(event.currentTarget.checked);
    setIdentifierState({
      ...identifierState,
      value: event.currentTarget.checked ? identifierState.list[0] : '',
    });
  };

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
        object: object[];
      }>('skip-duplicate', currentIndex);

      if (result.object.length === 0)
        navigate('/duplicate/success', { replace: true });

      setDuplicate({
        duplicate: result.object,
        currentIndex: currentIndex + 1,
        total,
        finishedDuplicate: [
          ...finishedDuplicate,
          {
            name: duplicate[0][keys[0]],
            type: 'skipped',
          },
        ],
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
        object: object[];
      }>('delete-duplicate', {
        index: currentIndex,
        newIdentfier: identifierState.value,
      });

      if (result.object.length === 0)
        navigate('/duplicate/success', { replace: true });

      setDuplicate({
        duplicate: result.object,
        currentIndex: currentIndex + 1,
        total,
        finishedDuplicate: [
          ...finishedDuplicate,
          {
            name: duplicate[0][keys[0]],
            type: 'merged',
          },
        ],
      });
    };

    return (
      <div className="container">
        <Stack sx={{ minWidth: 400 }}>
          <CloseIcon
            fontSize="small"
            style={{ marginLeft: 'auto', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
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
          <Checkbox
            label="Plug the first identifier by default"
            checked={plugDefault}
            onChange={handlePlugDefaultChange}
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
