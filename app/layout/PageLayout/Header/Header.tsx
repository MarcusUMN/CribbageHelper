import { Link, useNavigate } from 'react-router';
import { Title, Image, Burger, Group, ActionIcon } from '@mantine/core';
import { IconHeartFilled } from '@tabler/icons-react';

interface HeaderProps {
  drawerOpened: boolean;
  toggleDrawer: () => void;
}

export const Header = ({ drawerOpened, toggleDrawer }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <Group
      h="100%"
      w="100%"
      wrap="nowrap"
      ml="xs"
      style={{
        paddingInlineStart: `calc(
    (var(--app-shell-navbar-offset, 0rem) + var(--app-shell-padding)) - 250px
  )`,
        paddingInlineEnd:
          'calc(var(--app-shell-aside-offset, 0rem) + var(--app-shell-padding))'
      }}
    >
      <Burger
        opened={drawerOpened}
        onClick={toggleDrawer}
        size="sm"
        hiddenFrom="sm"
        color="white"
      />
      <Group justify="space-between" flex={1} wrap="nowrap" pr="xs">
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Image
            src="/ninja-logo.png"
            alt="Ninja logo"
            h={40}
            w="auto"
            fit="contain"
          />
          <Title order={1} c="black" visibleFrom="xs" lh={1}>
            CRIBBAGE NINJA
          </Title>
        </Link>
        <ActionIcon
          size="lg"
          variant="default"
          aria-label="Support"
          onClick={() => navigate('/support')}
        >
          <IconHeartFilled size={20} fill="#1D3757" />
        </ActionIcon>
      </Group>
    </Group>
  );
};
