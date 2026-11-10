import { useQuran } from "@/context/useQuran";

import { Flex } from "@chakra-ui/react";
import { ButtonSidebar } from "@/components/Generic/Buttons";

import { DisplayOptionsPopover } from "@/components/Custom/DisplayOptionsPopover";

interface ChapterHeaderProps {
  chapterID: number;
  isOpenMobile?: boolean;
  isOpenDesktop?: boolean;
  onTogglePanel?: (state: boolean) => void;
}

const ChapterHeader = ({
  chapterID,
  isOpenMobile,
  isOpenDesktop,
  onTogglePanel,
}: ChapterHeaderProps) => {
  const quranService = useQuran();

  return (
    <Flex
      bgColor="bg.muted"
      px={{ base: 2, md: 4 }}
      py={2}
      borderBottom="1px solid"
      borderColor="border"
      align="center"
      justifyContent={"space-between"}
      gap={2}
    >
      {onTogglePanel ? (
        <ButtonSidebar
          isOpenMobile={!!isOpenMobile}
          isOpenDesktop={!!isOpenDesktop}
          onTogglePanel={onTogglePanel}
        />
      ) : (
        <div></div>
      )}

      <Flex fontSize="2xl" fontWeight="medium" color="blue.focusRing">
        سورة {quranService.getChapterName(chapterID)}
      </Flex>

      <Flex>
        <DisplayOptionsPopover />
      </Flex>
    </Flex>
  );
};

export { ChapterHeader };
