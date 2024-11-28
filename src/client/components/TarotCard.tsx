import { Box, Image, type ImageProps } from "@yamada-ui/react";
import { Orientation, type TarotCardCategory } from "~/db/schema";

export const TarotCard = ({
  category,
  cardNumber,
  isReversed,
  orientation,
  ...props
}: {
  category: TarotCardCategory;
  cardNumber: number;
  isReversed?: boolean;
  orientation?: Orientation;
} & ImageProps) => (
  <Image
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
    {...props}
  />
);
