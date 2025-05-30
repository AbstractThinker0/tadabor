import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";

import { Flex, Button } from "@chakra-ui/react";
import { ButtonSidebar } from "@/components/Generic/Buttons";
import { MdFormatAlignRight } from "react-icons/md";
import { MdFormatAlignCenter } from "react-icons/md";
import { MdOutlineViewCompactAlt } from "react-icons/md";
import { RiExpandLeftRightLine } from "react-icons/ri";

interface ChapterHeaderProps {
  chapterID: number;
  isOpenMobile?: boolean;
  isOpenDesktop?: boolean;
  onTogglePanel?: (state: boolean) => void;
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
  const compactVerses = useAppSelector(
    (state) => state.navigation.compactVerses
  );

  const toggleCenterVerses = () => {
    dispatch(navigationActions.toggleCenterVerses());
  };

  const toggleCompactVerses = () => {
    dispatch(navigationActions.toggleCompactVerses());
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
      {onTogglePanel ? (
        <ButtonSidebar
          isOpenMobile={!!isOpenMobile}
          isOpenDesktop={!!isOpenDesktop}
          onTogglePanel={onTogglePanel}
        />
      ) : (
        <div></div>
      )}

      <Flex fontSize="3xl" fontWeight="medium" color="blue.focusRing">
        سورة {quranService.getChapterName(chapterID)}
      </Flex>

      <Flex gap={"0.5rem"}>
        <Button size="sm" onClick={toggleCenterVerses} colorPalette="blue">
          {centerVerses ? <MdFormatAlignRight /> : <MdFormatAlignCenter />}
        </Button>
        {versesOptions && (
          <Button size="sm" onClick={toggleCompactVerses} colorPalette="blue">
            {compactVerses ? (
              <RiExpandLeftRightLine />
            ) : (
              <MdOutlineViewCompactAlt />
            )}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export { ChapterHeader };
