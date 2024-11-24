import { List, ListItem, VStack } from "@yamada-ui/react";
import { hc } from "hono/client";
import { clientUrl } from "~/client/utils/clientUrl";
import type { SeedApi } from "~/server/routes";

export const client = hc<SeedApi>(clientUrl);

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
        <ListItem
          onClick={() => {
            client.api.seed.$get();
          }}
        >
          Seed
        </ListItem>
      </List>
    </VStack>
  );
};
