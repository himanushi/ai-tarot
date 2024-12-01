import { MenuIcon } from "@yamada-ui/lucide";
import {
  Box,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  HStack,
  Heading,
  IconButton,
  Spacer,
  useDisclosure,
} from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { Menu } from "../menu/Menu";

export const Header = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const nav = useNavigate();

  return (
    <Box as="header" bgColor="amber.500">
      <HStack>
        <Box padding="10px 20px">
          <Heading cursor="pointer" onClick={() => nav("/")}>
            占いのゲーム
          </Heading>
        </Box>
        <Spacer />
        {!isOpen ? (
          <IconButton
            variant="ghost"
            aria-label="Open navigation menu"
            color="muted"
            display={{ base: "none", lg: "inline-flex" }}
            icon={<MenuIcon fontSize="2xl" />}
            _hover={{ bg: ["blackAlpha.50", "whiteAlpha.100"] }}
            onClick={onOpen}
          />
        ) : (
          <CloseButton
            size="lg"
            aria-label="Close navigation menu"
            color="muted"
            display={{ base: "none", lg: "inline-flex" }}
            _hover={{ bg: ["blackAlpha.100", "whiteAlpha.50"] }}
            onClick={onClose}
          />
        )}
      </HStack>
      <Drawer
        closeOnDrag
        isFullHeight
        isOpen={isOpen}
        w="sm"
        withCloseButton={false}
        withDragBar={false}
        onClose={onClose}
      >
        <DrawerHeader
          fontSize="md"
          fontWeight="normal"
          justifyContent="flex-end"
          pt="sm"
        >
          <CloseButton
            size="lg"
            aria-label="Close navigation menu"
            color="muted"
            display={{ base: "none", lg: "inline-flex" }}
            _hover={{ bg: ["blackAlpha.100", "whiteAlpha.50"] }}
            onClick={onClose}
          />
        </DrawerHeader>
        <DrawerBody>
          <Menu onClose={onClose} />
        </DrawerBody>
      </Drawer>
    </Box>
  );
};
