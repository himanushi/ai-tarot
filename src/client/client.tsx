import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, UIProvider } from "@yamada-ui/react";
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

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <UIProvider>
      <Button>aaaa</Button>
      {/* <RouterProvider router={routes} /> */}
    </UIProvider>
  </StrictMode>,
);
