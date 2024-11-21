import { Box, Flex, Heading, Text, VStack } from "@yamada-ui/react";

export const Header = () => {
  return (
    <Box as="header" bgColor="amber.500">
      <VStack>
        <Heading>占いのゲーム</Heading>
      </VStack>
    </Box>
  );
};
