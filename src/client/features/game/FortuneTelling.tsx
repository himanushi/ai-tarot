import {
  Bleed,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
import { Fragment, useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { TarotCard } from "~/client/components/TarotCard";
import { clientUrl } from "~/client/utils/clientUrl";
import { Orientation, type TarotCardCategory } from "~/db/schema";
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
    <Flex direction="column">
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
      <Card>
        <CardHeader>
          <Text>{history?.question}</Text>
        </CardHeader>
        <CardBody>
          <Text>{history?.readingResult}</Text>
        </CardBody>
      </Card>
      <Spreads history={history} />
    </Flex>
  );
};

const getSpreadBounds = (
  positions: {
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
  }[],
) => {
  const xValues = positions.map((p) => p.x);
  const yValues = positions.map((p) => p.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1, // 必要な列数
    height: maxY - minY + 1, // 必要な行数
  };
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

  if (!history || !spread.positions) {
    return <></>;
  }

  const bounds = getSpreadBounds(spread.positions);

  return (
    <Flex direction="column" alignItems="center" justifyContent="center">
      <Heading>スプレッド</Heading>
      <Grid
        templateColumns={`repeat(${bounds.width}, minmax(0, 1fr))`}
        templateRows={`repeat(${bounds.height}, auto)`}
        maxWidth="90vw"
        maxHeight="90vh"
        height="auto"
        padding="30px"
        objectFit="contain"
        gapX="15%"
        gapY="1%"
      >
        {spread.positions.map((position, index) => {
          const card = cards.find((c) => c.id === history.dealDeck[index][0]);

          if (!card) {
            return <Fragment key={position.id} />;
          }

          const isReversed = history.dealDeck[index][1] === 1;

          return (
            <GridItem
              key={position.id}
              colStart={position.x - bounds.minX + 1}
              rowStart={position.y - bounds.minY + 1}
              padding=""
              position="relative"
              transform={
                position.orientation === Orientation.Vertical
                  ? isReversed
                    ? "rotate(180deg)"
                    : undefined
                  : isReversed
                    ? "rotate(90deg)"
                    : "rotate(270deg)"
              }
            >
              <TarotCard w="100%" maxW={150} card={card} />
            </GridItem>
          );
        })}
      </Grid>
    </Flex>
  );
};
