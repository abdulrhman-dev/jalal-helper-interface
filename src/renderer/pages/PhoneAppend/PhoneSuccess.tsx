import { Link, useNavigate } from 'react-router-dom';
import { Stack, List, ThemeIcon, Title, Button, Text } from '@mantine/core';
import { CircleCheck, CircleX } from 'tabler-icons-react';
import { useEffect } from 'react';
import { usePhone } from 'renderer/providers/PhoneProvider';

function Item({ index, name, success }) {
  return (
    <List.Item
      icon={
        !success ? (
          <ThemeIcon color="red" variant="filled" radius="xl">
            <CircleX size={20} />
          </ThemeIcon>
        ) : undefined
      }
    >
      [ {index + 1} ] {success ? 'Changed' : 'Prevented'} {name}
    </List.Item>
  );
}

export default function PhoneSuccess() {
  const { phoneResult } = usePhone();
  const navigate = useNavigate();

  useEffect(() => {
    if (phoneResult.length === 0) navigate('/duplicate/configure');
  }, [phoneResult, navigate]);

  console.log(phoneResult);

  return (
    <div className="container">
      <Stack
        sx={{
          width: 400,
        }}
      >
        <Title order={1}>
          Finised the Append
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
            width: 400,
            height: 350,
          }}
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <CircleCheck size={16} />
            </ThemeIcon>
          }
        >
          {phoneResult.map((item) => (
            <Item index={item.index} name={`${item.number}`} success={false} />
          ))}
        </List>
        <Link to="/phone/configure">
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
