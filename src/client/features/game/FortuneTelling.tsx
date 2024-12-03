import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
} from "@yamada-ui/react";
import { hc } from "hono/client";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
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

type CardType = {
  id: number;
  name: string;
  category: TarotCardCategory;
  cardNumber: number;
  description: string;
  uprightMeaning: string;
  reversedMeaning: string;
  createdAt: string;
  updatedAt: string;
};

type Spread = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
};

type Position = {
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
};

export const FortuneTelling = () => {
  const { questionId } = useLoaderData() as { questionId: number };
  const [history, setHistory] = useState<History>();
  const [isLoading, setIsLoading] = useState(false);

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

const getSpreadBounds = (positions: Position[]) => {
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

const getFractionalTranslate = (value: number): number => {
  const fractionalPart = value % 1;
  return fractionalPart * 100;
};

const Spreads = ({ history }: { history: History | undefined }) => {
  const [spread, setSpread] = useState<{
    spread?: Spread;
    positions?: Position[];
  }>({});

  const [cards, setCards] = useState<CardType[]>([]);

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
        gapX="2%"
        gapY="2%"
      >
        {spread.positions.map((position, index) => (
          <SpreadItem
            key={position.id}
            cards={cards}
            history={history}
            position={position}
            index={index}
            bounds={bounds}
          />
        ))}
      </Grid>
    </Flex>
  );
};

const SpreadItem = ({
  cards,
  history,
  position,
  index,
  bounds,
}: {
  cards: CardType[];
  history: History;
  position: Position;
  index: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
}) => {
  const card = cards.find((c) => c.id === history.dealDeck[index][0]);
  const isReversed = history.dealDeck[index][1] === 1;
  const translateX = getFractionalTranslate(position.x);
  const translateY = getFractionalTranslate(position.y);
  const rotate =
    position.orientation === Orientation.Vertical
      ? isReversed
        ? "rotate(180deg)"
        : ""
      : isReversed
        ? "rotate(90deg)"
        : "rotate(270deg)";

  if (!card) {
    return <Fragment key={position.id} />;
  }

  return (
    <GridItem
      key={position.id}
      colStart={Math.floor(position.x) - bounds.minX + 1}
      rowStart={Math.floor(position.y) - bounds.minY + 1}
      position="relative"
    >
      <TarotCard
        w="100%"
        maxW={150}
        card={card}
        transform={`translate(${translateX}%, ${translateY}%) ${rotate}`}
        zIndex={1}
        position="relative"
        description={`位置意味: ${position.displayName}`}
      />
    </GridItem>
  );
};
