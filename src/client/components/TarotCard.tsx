import { Box, Image } from "@yamada-ui/react";
import { TarotCardCategory } from "~/db/schema";

export const TarotCard = ({
  category,
  cardNumber,
}: {
  category: TarotCardCategory;
  cardNumber: number;
}) => (
  <Box>
    <Image
      src={`/static/cards/goodstudio/${TarotCardCategory.MajorArcana}_${0}.svg`}
      alt={`${category} ${cardNumber}`}
      w={100}
    />
  </Box>
);
