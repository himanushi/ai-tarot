import { Box, Image } from "@yamada-ui/react";
import { Orientation, type TarotCardCategory } from "~/db/schema";

export const TarotCard = ({
  category,
  cardNumber,
  isReversed,
  orientation,
}: {
  category: TarotCardCategory;
  cardNumber: number;
  isReversed?: boolean;
  orientation?: Orientation;
}) => (
  <Image
    minW={20}
    maxW={200}
    borderRadius="6px"
    src={`/static/cards/goodstudio/${category}_${cardNumber}.jpg`}
    alt={`${category} ${cardNumber}`}
    transform={
      isReversed
        ? orientation === Orientation.Vertical
          ? "rotate(180deg)"
          : "rotate(90deg)"
        : undefined
    }
  />
);
