import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Burger, Drawer, Group, Stack } from '@mantine/core';
import { IconHome, IconCalculator, IconBrain, IconCut } from '@tabler/icons-react';
import { Header } from '../Header';
import classes from './NavBar.module.css';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/calculator', label: 'Calculator', icon: IconCalculator },
  { link: '/hand-analyzer', label: 'Hand Analyzer', icon: IconBrain },
  { link: '/cut-card-insight', label: 'Cut Card Insight', icon: IconCut },
];

export const NavBar = ({ children }: any) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [active, setActive] = useState('');
  const router = useRouter();

  useEffect(() => {
    const current = data.find((item) => item.link === router.pathname);
    setActive(current?.label ?? '');
  }, [router.pathname]);

  const renderLinks = (isDrawer = false) =>
    data.map((item) => {
      const linkProps = {
        href: item.link,
        onClick: () => {
          setActive(item.label);
          if (isDrawer) setDrawerOpened(false);
        },
      };

      const content = (
        <React.Fragment>
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
        </React.Fragment>
      );

      return (
        <Link
          key={item.label}
          className={classes.link}
          data-active={item.label === active || undefined}
          {...linkProps}
        >
          {content}
        </Link>
      );
    });

  return (
    <React.Fragment>
      {/* Desktop Layout */}
      <div className={classes.wrapperDesktop}>
        <Header isMobile={false} />
        <div className={classes.navWrapper}>
          <nav className={classes.nav}>
            <div>{renderLinks()}</div>
          </nav>
          <main className={classes.mainDesktop}>{children}</main>
        </div>
      </div>
      {/* Mobile Layout */}
      <div className={classes.wrapperMobile}>
        <Group className={classes.groupBurgerHeader}>
          <Burger
            opened={drawerOpened}
            onClick={() => setDrawerOpened((o) => !o)}
            size="sm"
          />
          <Header isMobile />
        </Group>
        <Drawer
          opened={drawerOpened}
          onClose={() => setDrawerOpened(false)}
          padding="md"
          size="250px"
        >
          <Stack>{renderLinks(true)}</Stack>
        </Drawer>
        <div className={classes.pageWrapperMobile}>
          <main className={classes.mainMobile}>{children}</main>
        </div>
      </div>
    </React.Fragment>
  );
};
