import { Button, List, VStack } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { SeedApi } from "~/server/routes";

export const client = hc<SeedApi>(clientUrl);

export const Menu = ({ onClose = () => {} }: { onClose?: () => void }) => {
  const nav = useNavigate();

  return (
    <VStack as="nav">
      <List>
        <Button
          onClick={() => {
            nav("/questions/new");
            onClose();
          }}
        >
          占い
        </Button>
        <Button
          onClick={() => {
            nav("/questions");
            onClose();
          }}
        >
          履歴
        </Button>
        <Button
          onClick={() => {
            window.open("/api/auth/login", "_self");
            onClose();
          }}
        >
          Login
        </Button>
        <Button
          onClick={() => {
            client.api.seed.$get();
            onClose();
          }}
        >
          Seed
        </Button>
      </List>
    </VStack>
  );
};
