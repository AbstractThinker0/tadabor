import { useColoringPageStore } from "@/store/pages/coloringPage";

import { getTextColor } from "@/components/Pages/Coloring/util";

import type { colorProps } from "@/components/Pages/Coloring/consts";

import { Box, Flex, Spacer, useDisclosure } from "@chakra-ui/react";

import DeleteColorModal from "@/components/Pages/Coloring/DeleteColorModal";

const ColorsList = () => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();

  const coloredVerses = useColoringPageStore((state) => state.coloredVerses);

  const colorsList = useColoringPageStore((state) => state.colorsList);
  const selectColor = useColoringPageStore((state) => state.selectColor);
  const setCurrentColor = useColoringPageStore(
    (state) => state.setCurrentColor
  );

  function onClickSelectColor(color: colorProps) {
    selectColor(color);
  }

  function onClickDeleteColor(color: colorProps) {
    setCurrentColor(color);
    onOpen();
  }

  const getColoredVerses = (colorID: string | undefined) => {
    if (!colorID) return 0;

    return Object.keys(coloredVerses).filter((verseKey) => {
      return coloredVerses[verseKey]?.colorID === colorID;
    }).length;
  };

  return (
    <>
      <Box textAlign={"center"} dir="ltr">
        Colors list:
      </Box>
      {Object.keys(colorsList).length > 0 && (
        <Flex
          flexDir={"column"}
          overflowY={"auto"}
          fontFamily={"initial"}
          maxHeight={"30vh"}
          dir="ltr"
        >
          {Object.keys(colorsList).map((colorID) => (
            <Flex
              key={colorsList[colorID].colorID}
              justify={"space-between"}
              fontSize={"large"}
              cursor={"pointer"}
              mb={1}
              borderRadius={5}
              bgColor={colorsList[colorID].colorCode}
              color={getTextColor(colorsList[colorID].colorCode)}
              textAlign={"center"}
            >
              <Spacer onClick={() => onClickSelectColor(colorsList[colorID])} />
              <Flex
                overflowWrap={"break-word"}
                overflowX={"hidden"}
                justify={"center"}
                flex={2}
                onClick={() => onClickSelectColor(colorsList[colorID])}
              >
                {colorsList[colorID].colorDisplay} ({getColoredVerses(colorID)})
              </Flex>
              <Flex
                justifyContent={"end"}
                flex={1}
                onClick={() => onClickDeleteColor(colorsList[colorID])}
              >
                🗑️
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}
      <DeleteColorModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ColorsList;
