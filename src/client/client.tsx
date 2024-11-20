import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Container, Flex, UIProvider, extendConfig } from "@yamada-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
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
        <Flex>
          <Flex as="section" flex={1}>
            <Sidebar />
          </Flex>
          <Sidebar />
          <Flex as="main" flex={3}>
            <RouterProvider router={routes} />
          </Flex>
        </Flex>
      </UIProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
