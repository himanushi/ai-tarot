import { Stack, Text, VStack } from "@yamada-ui/react";
import { Game } from "~/client/features/game/Game";
import { Question } from "~/client/features/game/Question";
import { Spread } from "~/client/features/spread/Spread";

export const HomeLayout = () => {
  return (
    <VStack>
      <Question />
    </VStack>
  );
};
