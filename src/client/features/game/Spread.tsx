import { Button, Textarea, VStack, useAsyncCallback } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TarotSpreadsApi } from "~/server/routes";

const query = hc<TarotSpreadsApi>(clientUrl);

export const Spread = () => {
  const { questionId } = useLoaderData() as { questionId: number };
  const nav = useNavigate();

  useEffect(() => {
    if (!questionId) return;

    (async () => {
      const result = await query.api["choice-tarot-spreads"].$get({
        query: {
          questionId: questionId.toString(),
        },
      });
      const body = await result.json();
      console.log(body);
    })();
  }, [questionId]);

  // const [isLoading, onClick] = useAsyncCallback(async () => {
  //   const result = await query.api["tarot-draw-histories"].$post({
  //     json: { question },
  //   });
  //   const body = await result.json();
  //   if ("data" in body) nav(`/questions/${body.data.id}/spreads`);
  // }, [question, nav]);

  return (
    <VStack>
      {/* <Textarea
        placeholder="聞くことを入力してください"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        autosize
        minRows={5}
        maxRows={20}
      />
      <Button onClick={onClick} isLoading={isLoading} disabled={!question}>
        送信
      </Button> */}
    </VStack>
  );
};
