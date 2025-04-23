import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

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

  const dispatch = useAppDispatch();

  const onTogglePanel = (state: boolean) => {
    dispatch(coloringPageActions.setSearchPanel(state));
  };

  return (
    <ChapterHeader
      chapterID={selectChapter}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
      versesOptions={true}
    />
  );
};

export { ListTitle };
