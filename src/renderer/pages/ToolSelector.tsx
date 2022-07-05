import { Group, ThemeIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ToolSelector() {
  return (
    <div className="container">
      <Group position="center">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
          }}
        >
          <Link to="/configureDuplicates">
            <ThemeIcon
              variant="light"
              color="red"
              size={100}
              sx={{ borderRadius: '50%', cursor: 'pointer' }}
            >
              <ContentCopyIcon fontSize="medium" />
            </ThemeIcon>
          </Link>
          <h3>Duplicate manger</h3>
        </div>
      </Group>
    </div>
  );
}
