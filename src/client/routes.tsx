import { createBrowserRouter } from "react-router-dom";
import { FortuneTellingLayout } from "./pages/questions/FortuneTellingLayout";
import { QuestionLayout } from "./pages/questions/QuestionLayout";
import { ShuffleLayout } from "./pages/questions/ShuffleLayout";
import { SpreadLayout } from "./pages/questions/SpreadLayout";

const idLoader = ({ params }: any) => {
  const parsedIds = Object.keys(params)
    .filter((key) => key.endsWith("Id"))
    .reduce(
      (acc: Record<string, number>, key) => {
        acc[key] = Number.parseInt(params[key], 10);
        return acc;
      },
      {} as Record<string, number>,
    );

  return parsedIds;
};

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
    path: "/questions/:questionId/spreads",
    element: <SpreadLayout />,
    loader: idLoader,
  },
  {
    path: "/questions/:questionId/shuffle",
    element: <ShuffleLayout />,
    loader: idLoader,
  },
  {
    path: "/questions/:questionId/fortune-telling",
    element: <FortuneTellingLayout />,
    loader: idLoader,
  },
]);
