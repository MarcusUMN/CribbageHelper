import Link from 'next/link';
import { Title, Image } from '@mantine/core';
import classes from './Header.module.css';

interface HeaderProps {
  isMobile: boolean;
}

export const Header = ({ isMobile }: HeaderProps) => {
  return (
    <header className={classes.header}>
        <Link href="/" passHref className={classes.link}>
            <Image src="/ninja-logo.png" alt="Ninja logo" className={classes.image} />
            <Title order={1} c="#333333" style={{ fontSize: isMobile ? 24 : 32 }}>
                CRIBBAGE NINJA
            </Title>
        </Link>
    </header>
  );
}