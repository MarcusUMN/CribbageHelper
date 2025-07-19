import '@mantine/core/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '../../theme';
import { AppLayout } from '../layout/AppLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider forceColorScheme="light" theme={theme}>
      <Head>
        <title>Cribbage Ninja</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <AppLayout>
        <Component {...pageProps} />
        <Analytics />
      </AppLayout>
    </MantineProvider>
  );
}
