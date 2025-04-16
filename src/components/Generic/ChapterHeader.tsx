import { Box, Flex } from "@chakra-ui/react";

import { ButtonSidebar } from "@/components/Generic/Buttons";

interface ChapterHeaderProps {
  chapterName: string;
  isOpen: boolean;
  onTogglePanel: () => void;
}

const ChapterHeader = ({
  chapterName,
  isOpen,
  onTogglePanel,
}: ChapterHeaderProps) => {
  return (
    <Flex
      bgColor="bg.muted"
      px={"0.25rem"}
      border="1px solid"
      borderColor="border.emphasized"
      align="center"
      justifyContent={"space-between"}
      borderTopRadius={"l2"}
    >
      <ButtonSidebar isOpen={isOpen} onTogglePanel={onTogglePanel} />

      <Flex fontSize="3xl" fontWeight="medium" color="blue.focusRing">
        سورة {chapterName}
      </Flex>
      <Box width={"1rem"}></Box>
    </Flex>
  );
};

export { ChapterHeader };
