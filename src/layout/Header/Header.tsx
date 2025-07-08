import Link from 'next/link';
import { Title } from '@mantine/core';
import {IconCards } from '@tabler/icons-react';
import classes from './Header.module.css';

interface HeaderProps {
  isMobile: boolean;
}

export const Header = ({ isMobile }: HeaderProps) => {
  return (
    <header>
        <Link href="/" passHref className={classes.link}>
            <IconCards size={isMobile ? 24 : 32} stroke={1.5} color="#333333" />
            <Title order={1} c="#333333" style={{ fontSize: isMobile ? 24 : 32, margin: 0 }}>
                CRIBBAGE HELPER
            </Title>
        </Link>
    </header>
  );
}