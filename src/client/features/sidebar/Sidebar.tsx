import { Flex } from "@yamada-ui/react";
import { Menu } from "../menu/Menu";

export const Sidebar = () => {
  return (
    <Flex bgColor="amber.500">
      <Menu />
    </Flex>
  );
};
