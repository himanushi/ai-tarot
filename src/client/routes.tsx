import { createBrowserRouter } from "react-router-dom";
import { HomeLayout } from "~/client/pages/home/HomeLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
  },
]);
