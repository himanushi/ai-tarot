import { useMutation } from "@tanstack/react-query";
import { Box, Button, Text, Textarea, VStack } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TarotDrawHistoryApi } from "~/server/routes";

const query = hc<TarotDrawHistoryApi>(clientUrl);

export const Game = () => {
  const [question, setQuestion] = useState("");

  return (
    <VStack>
      <Textarea
        placeholder="聞くことを入力してください"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Button
        onClick={async () => {
          query.api["tarot-draw-histories"].$post({
            json: { question },
          });
        }}
      >
        送信
      </Button>
      <VStack>
        <Text fontSize="xl" fontWeight="bold">
          WHEEL of FORTUNE.
        </Text>
      </VStack>
    </VStack>
  );
};
