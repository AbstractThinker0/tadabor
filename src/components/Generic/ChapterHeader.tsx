import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";

import { Flex, Button, Box } from "@chakra-ui/react";
import { ButtonSidebar } from "@/components/Generic/Buttons";
import { MdFormatAlignCenter, MdFormatAlignRight } from "react-icons/md";

interface ChapterHeaderProps {
  chapterID: number;
  isOpenMobile: boolean;
  isOpenDesktop: boolean;
  onTogglePanel: (state: boolean) => void;
  versesOptions?: boolean;
}

const ChapterHeader = ({
  chapterID,
  isOpenMobile,
  isOpenDesktop,
  onTogglePanel,
  versesOptions = false,
}: ChapterHeaderProps) => {
  const quranService = useQuran();
  const dispatch = useAppDispatch();
  const centerVerses = useAppSelector((state) => state.navigation.centerVerses);

  const toggleCenterVerses = () => {
    dispatch(navigationActions.setCenterVerses(!centerVerses));
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
      <ButtonSidebar
        isOpenMobile={isOpenMobile}
        isOpenDesktop={isOpenDesktop}
        onTogglePanel={onTogglePanel}
      />

      <Flex fontSize="3xl" fontWeight="medium" color="blue.focusRing">
        سورة {quranService.getChapterName(chapterID)}
      </Flex>

      {versesOptions ? (
        <Button size="sm" onClick={toggleCenterVerses} colorPalette="blue">
          {centerVerses ? <MdFormatAlignRight /> : <MdFormatAlignCenter />}
        </Button>
      ) : (
        <Box width={"1rem"}></Box>
      )}
    </Flex>
  );
};

export { ChapterHeader };
