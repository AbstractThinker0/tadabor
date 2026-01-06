import { useLettersPageStore } from "@/store/pages/lettersPage";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useLettersPageStore((state) => state.currentChapter);

  const showSearchPanel = useLettersPageStore((state) => state.showSearchPanel);

  const showSearchPanelMobile = useLettersPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useLettersPageStore((state) => state.setSearchPanel);

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
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
