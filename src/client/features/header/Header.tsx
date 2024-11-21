import { Box, HStack, Heading } from "@yamada-ui/react";

export const Header = () => {
  return (
    <Box as="header" bgColor="amber.500">
      <HStack>
        <Heading>占いのゲーム</Heading>
      </HStack>
    </Box>
  );
};
