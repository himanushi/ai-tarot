import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  VStack,
  useNotice,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import { Fragment, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { TarotDrawHistoryApi, TarotSpreadsApi } from "~/server/routes";

const query = hc<TarotSpreadsApi & TarotDrawHistoryApi>(clientUrl);

type SpreadType = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const Shuffle = () => {
  const { questionId } = useLoaderData() as { questionId: number };
  const notice = useNotice({ limit: 3 });
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  return (
    <Flex h="calc(100dvh - 4em)" direction="column" gap="3">
      <Spacer flex={1} />
      <Button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await query.api["tarot-draw-histories"][":id"]["shuffle-deck"].$patch(
            { param: { id: questionId.toString() } },
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          notice({ title: "シャッフルしました", status: "success" });
          setIsLoading(false);
        }}
      >
        シャッフル
      </Button>
      <Button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await query.api["tarot-draw-histories"][":id"]["deal-cards"].$post({
            param: { id: questionId.toString() },
          });
          setIsLoading(false);
          nav(`/questions/${questionId}/fortune-telling`);
        }}
      >
        次へ
      </Button>
    </Flex>
  );
};
