import { Group, ThemeIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';

function ToolSelectorItem({ title, color, icon, link }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
      }}
    >
      <Link to={link}>
        <ThemeIcon
          variant="light"
          color={color}
          size={100}
          sx={{ borderRadius: '50%', cursor: 'pointer' }}
        >
          {icon}
        </ThemeIcon>
      </Link>
      <h3>{title}</h3>
    </div>
  );
}

export default function ToolSelector() {
  return (
    <div className="container">
      <Group position="center">
        <ToolSelectorItem
          link="/configureDuplicates"
          title="Duplicate manager"
          color="blue"
          icon={<ManageSearchOutlinedIcon fontSize="large" />}
        />
      </Group>
    </div>
  );
}
