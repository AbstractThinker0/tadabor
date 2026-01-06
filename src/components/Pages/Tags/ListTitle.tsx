import { useTagsPageStore } from "@/store/pages/tagsPage";

import { ChapterHeader } from "@/components/Custom/ChapterHeader";

const ListTitle = () => {
  const selectChapter = useTagsPageStore((state) => state.currentChapter);

  const showSearchPanel = useTagsPageStore((state) => state.showSearchPanel);

  const showSearchPanelMobile = useTagsPageStore(
    (state) => state.showSearchPanelMobile
  );

  const setSearchPanel = useTagsPageStore((state) => state.setSearchPanel);

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
