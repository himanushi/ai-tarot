import { Box, Button } from "@yamada-ui/react";

export const HomeLayout = () => {
  return (
    <Box>
      <Button
        onClick={() => {
          console.log("clicked");
        }}
      >
        click me
      </Button>
    </Box>
  );
};
