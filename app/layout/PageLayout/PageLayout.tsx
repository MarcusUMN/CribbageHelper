import { AppShell } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

const MAX_MAIN_WIDTH = 992;
const BASE_SIDEBAR = 200;

export const PageLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const dynamicWidth = `max(${BASE_SIDEBAR}px, calc((100vw - ${MAX_MAIN_WIDTH}px) / 2))`;

  return (
    <AppShell
      padding="md"
      header={{
        height: { base: 60, md: 100 }
      }}
      withBorder={false}
      navbar={{
        width: {
          base: BASE_SIDEBAR,
          md: dynamicWidth
        },
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      aside={{
        width: {
          base: BASE_SIDEBAR,
          md: dynamicWidth
        },
        breakpoint: 'sm',
        collapsed: { mobile: true }
      }}
    >
      <AppShell.Header>
        <Header drawerOpened={opened} toggleDrawer={toggle} />
      </AppShell.Header>

      <AppShell.Navbar
        {...(isMobile ? { w: 200 } : {})}
        style={{
          paddingInlineStart: `calc(
    (var(--app-shell-navbar-offset, 0rem) + var(--app-shell-padding)) - 250px
  )`
        }}
      >
        <NavBar drawerOpened={opened} onLinkClick={close} />
      </AppShell.Navbar>

      <AppShell.Main pb={100}>
        <Outlet />
      </AppShell.Main>
      <AppShell.Aside />

      <AppShell.Footer withBorder={true}>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default PageLayout;
