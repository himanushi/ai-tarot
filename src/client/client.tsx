import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Container, UIProvider, extendConfig } from "@yamada-ui/react";
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

const customConfig = extendConfig({ initialColorMode: "dark" });

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider config={customConfig}>
        <Container as="main" mx="auto" maxW="48em">
          <RouterProvider router={routes} />
        </Container>
      </UIProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
