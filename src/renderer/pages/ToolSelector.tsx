import { DefaultMantineColor, Group, ThemeIcon } from '@mantine/core';
import { Link } from 'react-router-dom';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

function ToolSelectorItem({
  title,
  color,
  icon,
  link,
}: {
  color: DefaultMantineColor;
  link: string;
  title: string;
  icon: JSX.Element;
}) {
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
          link="/duplicate/configure"
          title="Duplicate manager"
          color="cyan"
          icon={<ManageSearchOutlinedIcon fontSize="large" />}
        />
        <ToolSelectorItem
          link="/phone/configure"
          title="Egyptian Phone Code"
          color="orange"
          icon={<LocalPhoneIcon fontSize="large" />}
        />
      </Group>
    </div>
  );
}
