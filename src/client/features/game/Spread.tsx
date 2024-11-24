import { Button, Textarea, VStack, useAsyncCallback } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TarotDrawHistoryApi } from "~/server/routes";

const query = hc<TarotDrawHistoryApi>(clientUrl);

export const Question = () => {
  const [question, setQuestion] = useState("");
  const nav = useNavigate();

  const [isLoading, onClick] = useAsyncCallback(async () => {
    const result = await query.api["tarot-draw-histories"].$post({
      json: { question },
    });
    const body = await result.json();
    if ("data" in body) nav(`/questions/${body.data.id}/spreads`);
  }, [question, nav]);

  return (
    <VStack>
      <Textarea
        placeholder="聞くことを入力してください"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        autosize
        minRows={5}
        maxRows={20}
      />
      <Button onClick={onClick} isLoading={isLoading} disabled={!question}>
        送信
      </Button>
    </VStack>
  );
};
