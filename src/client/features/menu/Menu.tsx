import { Button, List, VStack } from "@yamada-ui/react";
import { hc } from "hono/client";
import { clientUrl } from "~/client/utils/clientUrl";
import type { SeedApi } from "~/server/routes";

export const client = hc<SeedApi>(clientUrl);

export const Menu = () => {
  return (
    <VStack as="nav">
      <List>
        <Button>占い</Button>
        <Button>履歴</Button>
        <Button>設定</Button>
        <Button
          onClick={() => {
            window.open("/api/auth/login", "_self");
          }}
        >
          Login
        </Button>
        <Button
          onClick={() => {
            client.api.seed.$get();
          }}
        >
          Seed
        </Button>
      </List>
    </VStack>
  );
};
