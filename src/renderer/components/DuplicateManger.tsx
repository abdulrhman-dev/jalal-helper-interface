import { Stack, Table, Progress, Button, Autocomplete } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useDuplicate,
  useSetDuplicate,
} from 'renderer/providers/DuplicateProvider';

export default function DuplicateManger() {
  const { duplicate, currentIndex, total } = useDuplicate();
  const navigate = useNavigate();

  useEffect(() => {
    if (duplicate.length === 0) navigate('/configure', { replace: true });
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
            label="New Merge identifier"
            placeholder="Pick one"
            data={[...new Set(duplicate.map((item) => item[keys[0]]))]}
          />
          <Button>Merge</Button>
          <Button variant="light">Skip</Button>
        </Stack>
      </div>
    );
  }
}
