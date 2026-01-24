import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";
import { theme } from "../../theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider forceColorScheme="light" theme={theme}>
          <Notifications zIndex={9999} position="top-center" />
          {children}
        </MantineProvider>
        <Analytics />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
