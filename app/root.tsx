import { Outlet } from 'react-router';
export { RootLayout as Layout } from './layout/RootLayout';
export { ErrorBoundary } from './layout/ErrorBoundary';

export default function App() {
  return <Outlet />;
}
