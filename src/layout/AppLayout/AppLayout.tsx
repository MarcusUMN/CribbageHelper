import React, { ReactNode } from 'react';
import { NavBar } from '../NavBar';

interface AppLayoutProps {
  children: ReactNode;
}
export const AppLayout = ({ children }: AppLayoutProps) => {
  return <NavBar>{children}</NavBar>;
};
