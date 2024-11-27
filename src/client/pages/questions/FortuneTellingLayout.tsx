import { VStack } from "@yamada-ui/react";
import { FortuneTelling } from "~/client/features/game/FortuneTelling";

export const FortuneTellingLayout = () => {
  return (
    <VStack>
      <FortuneTelling />
    </VStack>
  );
};
