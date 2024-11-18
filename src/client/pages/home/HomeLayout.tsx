import { Box, Button, Input, Wrap, useLoading } from "@yamada-ui/react";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const HomeLayout = () => {
  const { screen, page, background } = useLoading();

  const onLoadingScreen = async () => {
    try {
      screen.start();

      await wait(5000);
    } finally {
      screen.finish();
    }
  };

  const onLoadingPage = async () => {
    try {
      page.start();

      await wait(5000);
    } finally {
      page.finish();
    }
  };

  const onLoadingBackground = async () => {
    try {
      background.start();

      await wait(5000);
    } finally {
      background.finish();
    }
  };

  return (
    <Wrap gap="md">
      <Button onClick={onLoadingScreen}>Start screen loading</Button>
      <Button onClick={onLoadingPage}>Start page loading</Button>
      <Button onClick={onLoadingBackground}>Start background loading</Button>
      <Box w="full" p="md" bg={["primary", "secondary"]} color="white">
        This is Box
      </Box>
    </Wrap>
  );
};
