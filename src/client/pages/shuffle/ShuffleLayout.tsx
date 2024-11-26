import { VStack } from "@yamada-ui/react";
import { Shuffle } from "~/client/features/game/Shuffle";
import { Spread } from "~/client/features/game/Spread";

export const ShuffleLayout = () => {
  return (
    <VStack>
      <Shuffle />
    </VStack>
  );
};
