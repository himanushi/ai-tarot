import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ColorModeScript,
  UIProvider,
  defaultConfig,
  extendConfig,
} from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

const config = extendConfig({
  initialColorMode: "dark",
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider config={config}>
        <RouterProvider router={routes} />
      </UIProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    {/* <ColorModeScript initialColorMode={defaultConfig.initialColorMode} /> */}
    <App />
  </StrictMode>,
);
