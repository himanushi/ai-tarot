import { Box, Button, Wrap, useColorMode } from "@yamada-ui/react";

export const HomeLayout = () => {
  const { changeColorMode } = useColorMode();

  return (
    <Wrap gap="md">
      <Button onClick={() => changeColorMode("dark")}>
        Start screen loading
      </Button>
      <Box w="full" p="md" bg={["primary", "secondary"]} color="white">
        This is Box
      </Box>
    </Wrap>
  );
};
