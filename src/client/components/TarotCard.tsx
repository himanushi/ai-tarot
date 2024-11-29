import {
  Box,
  Button,
  Flex,
  Image,
  type ImageProps,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  useDisclosure,
} from "@yamada-ui/react";
import { Orientation, TarotCardCategory } from "~/db/schema";

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

type TarotCardProps = {
  isReversed?: boolean;
  orientation?: Orientation;
};

const categoryNames = {
  [TarotCardCategory.MajorArcana]: "大アルカナ",
  [TarotCardCategory.Swords]: "小アルカナ 剣",
  [TarotCardCategory.Cups]: "小アルカナ カップ",
  [TarotCardCategory.Wands]: "小アルカナ 杖",
  [TarotCardCategory.Pentacles]: "小アルカナ コイン",
};

export const TarotCard = ({
  card,
  isReversed = false,
  orientation = Orientation.Vertical,
  ...props
}: { card: CardType } & TarotCardProps & ImageProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const src = `/static/cards/goodstudio/${card.category}_${card.cardNumber}.jpg`;

  return (
    <>
      <Image
        cursor="pointer"
        onClick={onOpen}
        borderRadius="6px"
        src={src}
        alt={`${card.category} ${card.cardNumber}`}
        // transform={
        //   orientation === Orientation.Vertical
        //     ? isReversed
        //       ? "rotate(180deg)"
        //       : undefined
        //     : isReversed
        //       ? "rotate(90deg)"
        //       : "rotate(270deg)"
        // }
        {...props}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalHeader>{categoryNames[card.category]}</ModalHeader>

        <ModalBody
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={src}
            alt={`${card.category} ${card.cardNumber}`}
            borderRadius="6px"
            maxW={200}
          />
          <Text>{card.name}</Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            とじる
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
