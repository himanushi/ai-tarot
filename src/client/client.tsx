import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Box,
  Container,
  Flex,
  UIProvider,
  extendConfig,
} from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Header } from "./features/header/Header";
import { Sidebar } from "./features/sidebar/Sidebar";
import { routes } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
});

const customConfig = extendConfig({ initialColorMode: "dark" });

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider config={customConfig}>
        <Box>
          <Header />
          <Flex as="main">
            <Sidebar />
            <RouterProvider router={routes} />
          </Flex>
        </Box>
      </UIProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
