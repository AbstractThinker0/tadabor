import { useAppDispatch, useAppSelector } from "@/store";
import { lettersPageActions } from "@/store/slices/pages/letters";

import { ChapterHeader } from "@/components/Generic/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useAppSelector(
    (state) => state.lettersPage.currentChapter
  );

  const showSearchPanel = useAppSelector(
    (state) => state.lettersPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.lettersPage.showSearchPanelMobile
  );

  const dispatch = useAppDispatch();

  const onTogglePanel = (state: boolean) => {
    dispatch(lettersPageActions.setSearchPanel(state));
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

export { ListTitle };
