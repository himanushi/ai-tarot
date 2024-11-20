import { Box, Container } from "@yamada-ui/react";

export const HomeLayout = () => {
  return (
    <Box>
      <Box w="full" p="md" bg={["primary", "secondary"]} color="white">
        This is Box
      </Box>
      <Box w="full" p="md" bg={["primary", "secondary"]} color="white">
        This is Box
      </Box>
    </Box>
  );
};
