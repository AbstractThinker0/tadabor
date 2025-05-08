import { useAppDispatch, useAppSelector } from "@/store";
import { tagsPageActions } from "@/store/slices/pages/tags";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useAppSelector(
    (state) => state.tagsPage.currentChapter
  );

  const showSearchPanel = useAppSelector(
    (state) => state.tagsPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.tagsPage.showSearchPanelMobile
  );

  const dispatch = useAppDispatch();

  const onTogglePanel = (state: boolean) => {
    dispatch(tagsPageActions.setSearchPanel(state));
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
