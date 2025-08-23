import useQuran from "@/context/useQuran";

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
      px={"0.25rem"}
      border="1px solid"
      borderColor="border.emphasized"
      align="center"
      justifyContent={"space-between"}
      borderTopRadius={"l2"}
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
