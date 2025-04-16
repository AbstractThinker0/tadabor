import useQuran from "@/context/useQuran";
import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { useBreakpointValue } from "@chakra-ui/react";

import { ChapterHeader } from "@/components/Generic/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useAppSelector(
    (state) => state.coloringPage.currentChapter
  );

  const showSearchPanel = useAppSelector(
    (state) => state.coloringPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.coloringPage.showSearchPanelMobile
  );

  const quranService = useQuran();
  const chapterName = quranService.getChapterName(selectChapter);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const isOpen = isMobile ? showSearchPanelMobile : showSearchPanel;

  const dispatch = useAppDispatch();

  const onTogglePanel = () => {
    dispatch(coloringPageActions.setSearchPanel(!isOpen));
  };

  return (
    <ChapterHeader
      chapterName={chapterName}
      isOpen={isOpen}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ListTitle };
