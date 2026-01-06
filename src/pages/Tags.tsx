import { useEffect } from "react";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";
import { Sidebar } from "@/components/Generic/Sidebar";

import TagsSide from "@/components/Pages/Tags/TagsSide";
import TagsDisplay from "@/components/Pages/Tags/TagsDisplay";

import { Flex } from "@chakra-ui/react";
import { usePageNav } from "@/hooks/usePageNav";
import { useTagsPageStore } from "@/store/pages/tagsPage";
import { ErrorRefresh } from "@/components/Generic/ErrorRefresh";

function Tags() {
  usePageNav("nav.tags");

  const complete = useTagsPageStore((state) => state.complete);
  const error = useTagsPageStore((state) => state.error);
  const initializeTags = useTagsPageStore((state) => state.initializeTags);

  const showSearchPanel = useTagsPageStore((state) => state.showSearchPanel);
  const showSearchPanelMobile = useTagsPageStore(
    (state) => state.showSearchPanelMobile
  );
  const setSearchPanel = useTagsPageStore((state) => state.setSearchPanel);

  useEffect(() => {
    initializeTags();
  }, [initializeTags]);

  const setOpenState = (state: boolean) => {
    setSearchPanel(state);
  };

  if (error) return <ErrorRefresh message="Failed to load tags data." />;

  if (!complete) return <LoadingSpinner text="Loading tags.." />;

  return (
    <Flex bgColor={"brand.bg"} overflow={"hidden"} maxH={"100%"} h={"100%"}>
      <Sidebar
        isOpenMobile={showSearchPanelMobile}
        isOpenDesktop={showSearchPanel}
        setOpenState={setOpenState}
      >
        <TagsSide />
      </Sidebar>
      <TagsDisplay />
    </Flex>
  );
}

export default Tags;
