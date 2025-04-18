import {
  CloseButton,
  Collapsible,
  Drawer,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";

interface SidebarProps {
  isOpenMobile: boolean;
  isOpenDesktop: boolean;
  setOpenState: (state: boolean) => void;
  children: React.ReactNode;
}

const Sidebar = ({
  isOpenMobile,
  isOpenDesktop,
  setOpenState,
  children,
}: SidebarProps) => {
  // Use Chakra's breakpoint to determine if it's mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isOpen = isMobile ? isOpenMobile : isOpenDesktop;

  const handleChangeOpen = (state: boolean) => {
    setOpenState(state);
  };

  return (
    <>
      {isMobile ? (
        <Drawer.Root
          open={isOpen}
          onOpenChange={(e) => handleChangeOpen(e.open)}
          placement={"start"}
          initialFocusEl={() => null}
          lazyMount
          unmountOnExit
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Body px={1} py={0}>
                  {children}
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.CloseTrigger asChild>
                    <CloseButton
                      border="2px solid"
                      borderColor="gray.600"
                      borderRadius="full"
                      size="sm"
                    />
                  </Drawer.CloseTrigger>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      ) : (
        <Collapsible.Root open={isOpen} lazyMount unmountOnExit>
          <Collapsible.Content>{children}</Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  );
};

export { Sidebar };
