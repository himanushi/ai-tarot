import { Stack, Text, VStack } from "@yamada-ui/react";
import { Game } from "~/client/features/game/Game";
import { Spread } from "~/client/features/spread/Spread";

export const HomeLayout = () => {
  return (
    <VStack>
      <Game />
    </VStack>
  );
};
