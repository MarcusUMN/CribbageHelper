import { Link, useNavigate } from "react-router";
import { Title, Image, Burger, Group, ActionIcon } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

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
      pl="xs"
      gap="xs"
      style={{
        paddingInlineEnd:
          "calc(var(--app-shell-aside-offset, 0rem) + var(--app-shell-padding))",
      }}
    >
      <Burger
        opened={drawerOpened}
        onClick={toggleDrawer}
        size="sm"
        hiddenFrom="sm"
        color="white"
      />
      <Group justify="space-between" flex={1} wrap="nowrap">
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            paddingLeft: "0.5rem",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Image
            src="/ninja-logo.png"
            alt="Ninja logo"
            h={40}
            w="auto"
            fit="contain"
          />
          <Title order={1} c="white" visibleFrom="xs" lh={1}>
            CRIBBAGE NINJA
          </Title>
        </Link>
        <ActionIcon
          color="red"
          size="lg"
          variant="filled"
          aria-label="Support"
          onClick={() => navigate("/support")}
        >
          <IconHeart size={20} />
        </ActionIcon>
      </Group>
    </Group>
  );
};
