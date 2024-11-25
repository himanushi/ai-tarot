import { Stack, Text, VStack } from "@yamada-ui/react";
import { Question } from "~/client/features/game/Question";

export const QuestionLayout = () => {
  return (
    <VStack>
      <Question />
    </VStack>
  );
};
