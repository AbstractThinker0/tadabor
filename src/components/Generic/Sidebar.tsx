import {
  CloseButton,
  Collapsible,
  Drawer,
  Portal,
  useBreakpointValue,
} from "@chakra-ui/react";

interface SidebarProps {
  isOpen: boolean;
  setOpenState: (state: boolean) => void;
  children: React.ReactNode;
}

const Sidebar = ({ isOpen, setOpenState, children }: SidebarProps) => {
  // Use Chakra's breakpoint to determine if it's mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

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
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
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
