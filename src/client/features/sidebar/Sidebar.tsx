import { Flex } from "@yamada-ui/react";
import { Menu } from "../menu/Menu";

export const Sidebar = () => {
  return (
    <Flex
      as="aside"
      display={{
        base: "flex",
        lg: "none",
      }}
      w="sm"
      bgColor="amber.500"
    >
      <Menu />
    </Flex>
  );
};
