import { Link, useNavigate } from 'react-router-dom';
import { Stack, List, ThemeIcon, Title, Button, Text } from '@mantine/core';
import { useDuplicate } from 'renderer/providers/DuplicateProvider';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { useEffect } from 'react';

function Item({ index, name, success }) {
  return (
    <List.Item
      icon={
        !success ? (
          <ThemeIcon color="gray" variant="light" radius="xl">
            <CircleX size={20} />
          </ThemeIcon>
        ) : undefined
      }
    >
      [ {index + 1} ] {success ? 'Merged' : 'Skipped'} {name}
    </List.Item>
  );
}

export default function DuplicateSuccess() {
  const { finishedDuplicate } = useDuplicate();
  const navigate = useNavigate();

  useEffect(() => {
    if (finishedDuplicate.length === 0) navigate('/duplicate/configure');
  }, [finishedDuplicate, navigate]);

  return (
    <div className="container">
      <Stack
        sx={{
          width: 350,
        }}
      >
        <Title order={1}>
          Finised the merging
          <Text color="green" inherit component="span">
            {' Successfully'}
          </Text>
        </Title>
        <List
          spacing="xs"
          size="sm"
          sx={{
            fontWeight: 'bold',
            overflowY: 'scroll',
            height: 350,
          }}
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <CircleCheck size={16} />
            </ThemeIcon>
          }
        >
          {finishedDuplicate.map((item, index) => (
            <Item
              index={index}
              name={item.name}
              success={item.type === 'merged'}
            />
          ))}
        </List>
        <Link to="/duplicate/configure">
          <Button
            sx={{ width: 350, marginTop: 20 }}
            variant="light"
            color="green"
          >
            Go Back
          </Button>
        </Link>
      </Stack>
    </div>
  );
}
