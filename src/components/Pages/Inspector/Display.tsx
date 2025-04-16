import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { inspectorPageActions } from "@/store/slices/pages/inspector";

import { ChapterHeader } from "@/components/Generic/ChapterHeader";

import ListVerses from "@/components/Pages/Inspector/ListVerses";
import { Box } from "@chakra-ui/react";

interface DisplayProps {
  currentChapter: string;
}

const Display = ({ currentChapter }: DisplayProps) => {
  const refDisplay = useRef<HTMLDivElement>(null);

  // Reset scroll whenever we switch from one chapter to another
  useEffect(() => {
    if (!refDisplay.current) return;

    refDisplay.current.scrollTop = 0;
  }, [currentChapter]);

  return (
    <Box
      padding={"0.5rem"}
      smDown={{ padding: "0.2rem" }}
      flex={1}
      overflowY={"scroll"}
      minH={"100%"}
      ref={refDisplay}
    >
      <Box
        bgColor={"brand.contrast"}
        minH={"100%"}
        border={"1px solid"}
        borderColor={"border.emphasized"}
        color={"inherit"}
        borderRadius={"l3"}
      >
        <ListTitle />
        <ListVerses currentChapter={currentChapter} />
      </Box>
    </Box>
  );
};

const ListTitle = () => {
  const selectChapter = useAppSelector(
    (state) => state.inspectorPage.currentChapter
  );

  const showSearchPanel = useAppSelector(
    (state) => state.inspectorPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.inspectorPage.showSearchPanelMobile
  );

  const dispatch = useAppDispatch();

  const onTogglePanel = (state: boolean) => {
    dispatch(inspectorPageActions.setSearchPanel(state));
  };

  return (
    <ChapterHeader
      chapterID={Number(selectChapter)}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export default Display;
