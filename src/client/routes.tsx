import { createBrowserRouter } from "react-router-dom";
import { QuestionLayout } from "./pages/questions/QuestionLayout";
import { SpreadLayout } from "./pages/spreads/SpreadLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <QuestionLayout />,
  },
  {
    path: "/questions",
    element: <QuestionLayout />,
  },
  {
    path: "/questions/:id/spreads",
    element: <SpreadLayout />,
  },
]);
