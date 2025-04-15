import { useAppDispatch, useAppSelector } from "@/store";
import { qbPageActions } from "@/store/slices/pages/quranBrowser";
import {
  CloseButton,
  Collapsible,
  Drawer,
  Flex,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";

import SearchPanel from "@/components/Pages/QuranBrowser/SearchPanel";
import DisplayPanel from "@/components/Pages/QuranBrowser/DisplayPanel";
import { usePageNav } from "@/hooks/usePageNav";

function QuranBrowser() {
  usePageNav("nav_browser");
  const dispatch = useAppDispatch();

  const showSearchPanel = useAppSelector(
    (state) => state.qbPage.showSearchPanel
  );

  const showSearchPanelMobile = useAppSelector(
    (state) => state.qbPage.showSearchPanelMobile
  );

  // Use Chakra's breakpoint to determine if it's mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex bgColor="brand.bg" overflow="hidden" maxH="100%" h="100%">
      {isMobile ? (
        <Drawer.Root
          open={showSearchPanelMobile}
          onOpenChange={(e) => dispatch(qbPageActions.setSearchPanel(e.open))}
          placement={"start"}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Body px={1} py={0}>
                  <SearchPanel />
                </Drawer.Body>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      ) : (
        <Collapsible.Root open={showSearchPanel} lazyMount unmountOnExit>
          <Collapsible.Content>
            <SearchPanel />
          </Collapsible.Content>
        </Collapsible.Root>
      )}
      <DisplayPanel />
    </Flex>
  );
}

export default QuranBrowser;
