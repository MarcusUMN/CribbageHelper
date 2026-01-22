import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "../../theme";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

export const RootLayout = () => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Outlet />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};
