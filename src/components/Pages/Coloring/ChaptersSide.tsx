import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store";

import ChaptersList from "@/components/Pages/Coloring/ChaptersList";
import AddColorModal from "@/components/Pages/Coloring/AddColorModal";

import EditColorsModal from "@/components/Pages/Coloring/EditColorsModal";
import ColorsList from "@/components/Pages/Coloring/ColorsList";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";

const ChaptersSide = () => {
  const {
    isOpen: isOpenAddColor,
    onOpen: onOpenAddColor,
    onClose: onCloseAddColor,
  } = useDisclosure();

  const {
    isOpen: isOpenEditColor,
    onOpen: onOpenEditColor,
    onClose: onCloseEditColor,
  } = useDisclosure();

  return (
    <Flex
      flexDir={"column"}
      maxW={"350px"}
      pt={"8px"}
      paddingInlineStart={"8px"}
      paddingInlineEnd={"4px"}
    >
      <ChaptersList />
      <Flex
        flexDir={"column"}
        minH={"30%"}
        maxH={"50%"}
        mt={"10px"}
        border={"1px solid rgb(201, 202, 204)"}
        p={"10px"}
        pt={"2px"}
        bgColor={"rgb(245, 244, 244)"}
        borderRadius={"0.275rem"}
      >
        <ColorsList />

        <Flex gap={2} justify={"center"} dir="ltr">
          <Button colorScheme="green" onClick={onOpenAddColor}>
            Add color
          </Button>
          <Button colorScheme="cyan" onClick={onOpenEditColor}>
            Edit colors
          </Button>
        </Flex>
      </Flex>

      <VersesCount />

      <AddColorModal isOpen={isOpenAddColor} onClose={onCloseAddColor} />
      <EditColorsModal isOpen={isOpenEditColor} onClose={onCloseEditColor} />
    </Flex>
  );
};

const VersesCount = () => {
  const { t } = useTranslation();
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );
  const selectedChapters = useAppSelector(
    (state) => state.coloringPage.selectedChapters
  );
  const selectedColors = useAppSelector(
    (state) => state.coloringPage.selectedColors
  );

  const getColoredVersesCount = () => {
    const asArray = Object.entries(coloredVerses);

    const filtered = asArray.filter(([key, color]) => {
      const info = key.split("-");
      return (
        selectedChapters[info[0]] === true && selectedColors[color.colorID]
      );
    });

    return filtered.length;
  };

  const selectedCount = getColoredVersesCount();

  if (!Object.keys(selectedColors).length) return null;

  return <Text color={"green"}>{`${t("search_count")} ${selectedCount}`}</Text>;
};

export default ChaptersSide;
