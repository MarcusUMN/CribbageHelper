import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Burger, Drawer, Group, Stack } from '@mantine/core';
import { IconHome, IconCalculator, IconBrain, IconCut } from '@tabler/icons-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import classes from './NavBar.module.css';

type NavItem =
  | { type: 'link'; link: string; label: string; icon: React.FC<any> }
  | { type: 'section'; label: string };

const data: NavItem[] = [
  { type: 'link', link: '/', label: 'Home', icon: IconHome },
  { type: 'section', label: 'Calculater' },
  { type: 'link', link: '/hand-calculator', label: 'Hand Calculator', icon: IconCalculator },
  { type: 'link', link: '/pegging-calculator', label: 'Pegging Calculator', icon: IconCalculator },
  { type: 'section', label: 'Probabilities / Analysis' },
  { type: 'link', link: '/hand-optimizer', label: 'Hand Optimizer', icon: IconCut },
  { type: 'link', link: '/cut-probabilities', label: 'Cut Probabilities', icon: IconCut },
  { type: 'section', label: 'Info' },
  { type: 'link', link: '/support', label: 'Support', icon: IconBrain },
];

export const NavBar = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [active, setActive] = useState('');
  const router = useRouter();

  useEffect(() => {
    const current = data.find(
      (item): item is Extract<NavItem, { type: 'link' }> => item.type === 'link' && item.link === router.pathname
    );
    setActive(current?.label ?? '');
  }, [router.pathname]);

  const renderLinks = (isDrawer = false) =>
    data.map((item) => {
      if (item.type === 'section') {
        return (
          <div key={item.label} className={classes.sectionLabel}>
            {item.label}
          </div>
        );
      }

      const Icon = item.icon;

      return (
        <Link
          key={item.label}
          href={item.link}
          onClick={() => {
            setActive(item.label);
            if (isDrawer) setDrawerOpened(false);
          }}
          className={classes.link}
          data-active={item.label === active || undefined}
        >
          <Icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.label}</span>
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
          <main className={classes.mainDesktop}>
            {children} 
            <Footer />
          </main>
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
          zIndex={1001}
        >
          <Stack>{renderLinks(true)}</Stack>
        </Drawer>
        <div className={classes.pageWrapperMobile}>
          <main className={classes.mainMobile}>
            {children}
             <Footer />
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};
