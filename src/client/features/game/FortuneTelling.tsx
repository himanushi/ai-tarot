import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Text,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import { use } from "hono/jsx";
import { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { TarotCard } from "~/client/components/TarotCard";
import { clientUrl } from "~/client/utils/clientUrl";
import type { Orientation, TarotCardCategory } from "~/db/schema";
import type {
  TarotCardsApi,
  TarotDrawHistoryApi,
  TarotSpreadsApi,
} from "~/server/routes";

const query = hc<TarotDrawHistoryApi & TarotSpreadsApi & TarotCardsApi>(
  clientUrl,
);

type History = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  spreadId: number | null;
  modelName: string;
  question: string;
  deck: [number, number][];
  dealDeck: [number, number][];
  readingResult: string | null;
  errorMessage: string | null;
  isArchived: boolean;
};

export const FortuneTelling = () => {
  const { questionId } = useLoaderData() as { questionId: number };
  const [history, setHistory] = useState<History>();
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const load = useCallback(async () => {
    const result = await query.api["tarot-draw-histories"][":id"].$get({
      param: { id: questionId.toString() },
    });
    const body = await result.json();
    if ("data" in body) {
      setHistory(body.data);
    }
  }, [questionId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Flex direction="column" h="calc(100dvh - 4rem)">
      <Spreads history={history} />
      <Button
        disabled={isLoading}
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await query.api["tarot-draw-histories"][":id"][
            "fortune-telling"
          ].$get({
            param: { id: questionId.toString() },
          });
          await load();
          setIsLoading(false);
        }}
      >
        占う
      </Button>
      <Text>{history?.question}</Text>
      <Text>{history?.readingResult}</Text>
    </Flex>
  );
};

const Spreads = ({ history }: { history: History | undefined }) => {
  const [spread, setSpread] = useState<{
    spread?: {
      id: number;
      name: string;
      createdAt: string;
      updatedAt: string;
      description: string;
    };
    positions?: {
      id: number;
      createdAt: string;
      updatedAt: string;
      description: string;
      spreadId: number;
      drawOrder: number;
      x: number;
      y: number;
      orientation: Orientation;
      displayName: string;
    }[];
  }>({});

  const [cards, setCards] = useState<
    {
      id: number;
      name: string;
      category: TarotCardCategory;
      cardNumber: number;
      description: string;
      uprightMeaning: string;
      reversedMeaning: string;
      createdAt: string;
      updatedAt: string;
    }[]
  >([]);

  useEffect(() => {
    if (history?.spreadId) {
      query.api["tarot-spreads"][":id"]
        .$get({
          param: { id: history.spreadId.toString() },
        })
        .then(async (result) => {
          const body = await result.json();
          if ("data" in body) {
            setSpread(body.data);
          }
        });

      query.api["tarot-cards"]
        .$get({
          query: {
            ids: history.dealDeck.map((d) => d[0]).join(","),
          },
        })
        .then(async (result) => {
          const body = await result.json();
          if ("data" in body) {
            setCards(body.data);
          }
        });
    }
  }, [history]);

  if (!history) {
    return <></>;
  }

  return (
    <Flex flex={1} direction="column">
      <Heading>スプレッド</Heading>
      <Grid templateColumns="repeat(10, 1fr)" gap={2}>
        {spread.positions?.map((position, index) => {
          const card = cards.find((c) => c.id === history.dealDeck[index][0]);

          if (!card) {
            return <Box key={position.id} />;
          }

          return (
            <GridItem
              key={position.id}
              gridColumn={position.x + 1}
              gridRow={position.y + 1}
            >
              <TarotCard
                category={card?.category}
                cardNumber={card?.cardNumber}
                orientation={position.orientation}
                isReversed={history.dealDeck[index][1] === 0}
              />
              <Text textAlign="center">{position.displayName}</Text>
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
};