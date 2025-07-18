import { Head, Html, Main, NextScript } from 'next/document';
import { mantineHtmlProps } from '@mantine/core';

export default function Document() {
  return (
    <Html lang="en" {...mantineHtmlProps}>
      <Head>
      </Head>
      <body style={{ backgroundColor: '#8FCFC0'}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
