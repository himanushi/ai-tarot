import {
  ColorModeScript,
  type ColorModeWithSystem,
  ThemeSchemeScript,
  defaultConfig,
} from "@yamada-ui/react";
import { getCookie } from "hono/cookie";
import { createFactory } from "hono/factory";
import { renderToString } from "react-dom/server";

export const server = createFactory().createHandlers((c) => {
  const colorMode = getCookie(c, "ui-color-mode") as
    | ColorModeWithSystem
    | undefined;
  const themeScheme = getCookie(c, "ui-theme-scheme");

  const initialColorMode = colorMode ?? defaultConfig.initialColorMode;
  const initialThemeScheme = themeScheme ?? defaultConfig.initialThemeScheme;

  return c.html(
    renderToString(
      <html lang="en">
        <head>
          {/* <link
            href="https://fonts.googleapis.com/css?family=Noto+Sans+JP"
            rel="stylesheet"
          />
          <link href="/static/style.css" rel="stylesheet" /> */}
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js" />
          ) : (
            <script type="module" src="/src/client/client.tsx" />
          )}
        </head>
        <body>
          <ColorModeScript
            type="cookie"
            nonce="testing"
            initialColorMode={initialColorMode}
          />
          <ThemeSchemeScript
            type="cookie"
            nonce="testing"
            initialThemeScheme={initialThemeScheme}
          />
          <div id="root" />
        </body>
      </html>,
    ),
  );
});
