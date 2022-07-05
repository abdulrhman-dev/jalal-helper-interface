import { Group, ThemeIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

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
              color="blue"
              size={100}
              sx={{ borderRadius: '50%', cursor: 'pointer' }}
            >
              <ManageSearchOutlinedIcon fontSize="large" />
            </ThemeIcon>
          </Link>
          <h3>Duplicate manager</h3>
        </div>
      </Group>
    </div>
  );
}
