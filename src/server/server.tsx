import { createFactory } from "hono/factory";
import { renderToString } from "react-dom/server";

export const server = createFactory().createHandlers((c) => {
  return c.html(
    renderToString(
      <html lang="en">
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
            data-next-head=""
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DotGothic16&family=Noto+Sans+JP:wght@100..900&display=swap"
            rel="stylesheet"
          />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js" />
          ) : (
            <script type="module" src="/src/client/client.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>,
    ),
  );
});
