import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";

import { ButtonSidebar } from "@/components/Generic/Buttons";
import useQuran from "@/context/useQuran";

interface ChapterHeaderProps {
  chapterID: number;
  isOpenMobile: boolean;
  isOpenDesktop: boolean;
  onTogglePanel: (state: boolean) => void;
}

const ChapterHeader = ({
  chapterID,
  isOpenMobile,
  isOpenDesktop,
  onTogglePanel,
}: ChapterHeaderProps) => {
  const quranService = useQuran();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? isOpenMobile : isOpenDesktop;

  const handlePanelToggle = () => {
    onTogglePanel(!isOpen);
  };

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
      <ButtonSidebar isOpen={isOpen} onTogglePanel={handlePanelToggle} />

      <Flex fontSize="3xl" fontWeight="medium" color="blue.focusRing">
        سورة {quranService.getChapterName(chapterID)}
      </Flex>
      <Box width={"1rem"}></Box>
    </Flex>
  );
};

export { ChapterHeader };
