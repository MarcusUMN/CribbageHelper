import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
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
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider forceColorScheme="light" theme={theme}>
          <Notifications zIndex={9999} position="top-center" />
          <Outlet />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};
