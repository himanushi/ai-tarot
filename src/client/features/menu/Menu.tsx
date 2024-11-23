import { List, ListItem, VStack } from "@yamada-ui/react";

export const Menu = () => {
  return (
    <VStack as="nav" bgColor="amber.500">
      <List>
        <ListItem>占い</ListItem>
        <ListItem>履歴</ListItem>
        <ListItem>設定</ListItem>
        <ListItem
          onClick={() => {
            window.open("/api/auth/login", "_self");
          }}
        >
          Login
        </ListItem>
      </List>
    </VStack>
  );
};
