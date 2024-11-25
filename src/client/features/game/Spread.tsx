import { Box, Button, Flex, Text, VStack } from "@yamada-ui/react";
import { hc } from "hono/client";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { clientUrl } from "~/client/utils/clientUrl";
import type { tarotSpreads } from "~/db/schema";
import type { TarotSpreadsApi } from "~/server/routes";

const query = hc<TarotSpreadsApi>(clientUrl);

type SpreadType = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export const Spread = () => {
  const { questionId } = useLoaderData() as { questionId: number };
  const [spreads, setSpreads] = useState<SpreadType[]>([]);
  const [recommendedSpreadId, setRecommendedSpreadId] = useState(1);
  const recommendedSpread = spreads.find((s) => s.id === recommendedSpreadId);

  useEffect(() => {
    (async () => {
      const result = await query.api["choice-tarot-spreads"].$get({
        query: {
          questionId: questionId.toString(),
        },
      });
      const body = await result.json();
      if ("data" in body) {
        setRecommendedSpreadId(body.data.recommendedSpreadId);
        const result2 = await query.api["tarot-spreads"].$get();
        const body2 = await result2.json();
        if ("data" in body2) {
          setSpreads(body2.data);
        }
      }
    })();
  }, [questionId]);

  return (
    <VStack>
      <Text>スプレッドを選択してください</Text>
      <Text>おすすめのスプレッド</Text>
      {recommendedSpread && <SpreadButton spread={recommendedSpread} />}
      {spreads
        .filter((spread) => spread.id !== recommendedSpreadId)
        .map((spread) => (
          <SpreadButton key={spread.id} spread={spread} />
        ))}
    </VStack>
  );
};

const SpreadButton = ({ spread }: { spread: SpreadType }) => {
  const nav = useNavigate();

  return <Button>{spread.name}</Button>;
};
