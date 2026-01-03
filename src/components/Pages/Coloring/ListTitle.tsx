import { useColoringPageStore } from "@/store/zustand/coloringPage";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useColoringPageStore((state) => state.currentChapter);

  const showSearchPanel = useColoringPageStore(
    (state) => state.showSearchPanel
  );

  const showSearchPanelMobile = useColoringPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useColoringPageStore((state) => state.setSearchPanel);

  const onTogglePanel = (state: boolean) => {
    setSearchPanel(state);
  };

  return (
    <ChapterHeader
      chapterID={selectChapter}
      isOpenMobile={showSearchPanelMobile}
      isOpenDesktop={showSearchPanel}
      onTogglePanel={onTogglePanel}
    />
  );
};

export { ListTitle };
