import { Button, Flex, Spacer, Text } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TarotDrawHistoryApi } from "~/server/routes";

const query = hc<TarotDrawHistoryApi>(clientUrl);

type History = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  spreadId: number | null;
  modelName: string;
  question: string;
  deck: [number, number][];
  readingResult: string | null;
  errorMessage: string | null;
  isArchived: boolean;
};

export const FortuneTelling = () => {
  const { questionId } = useLoaderData() as { questionId: number };
  const [history, setHistory] = useState<History>();
  const nav = useNavigate();

  const load = async () => {
    const result = await query.api["tarot-draw-histories"][":id"].$get({
      param: { id: questionId.toString() },
    });
    const body = await result.json();
    if ("data" in body) {
      setHistory(body.data);
    }
  };

  useEffect(() => {
    load();
  });

  return (
    <Flex direction="column" h="calc(100dvh - 4rem)">
      <Spacer flex={1} />
      <Button
        onClick={async () => {
          await load();
        }}
      >
        占う
      </Button>
      <Text>{history?.question}</Text>
    </Flex>
  );
};
