import { Stack, Text, VStack } from "@yamada-ui/react";
import { Spread } from "~/client/features/spread/Spread";

export const HomeLayout = () => {
  return (
    <VStack>
      <Stack>
        <Text>Home</Text>
      </Stack>
      <Stack>
        <Spread />
      </Stack>
    </VStack>
  );
};
