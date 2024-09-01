import {
  Tabs,
  TabsProps,
  TabPanels,
  TabPanelsProps,
  TabPanel,
  TabPanelProps,
} from "@chakra-ui/react";

const TabsContainer = (props: TabsProps) => {
  const { children, ...rest } = props;

  return (
    <Tabs
      backgroundColor={"var(--color-primary)"}
      overflow="hidden"
      maxH="100%"
      h="100%"
      display={"flex"}
      flexDirection={"column"}
      {...rest}
    >
      {children}
    </Tabs>
  );
};

const TabsPanels = (props: TabPanelsProps) => {
  const { children, ...rest } = props;

  return (
    <TabPanels flex={1} overflow={"hidden"} {...rest}>
      {children}
    </TabPanels>
  );
};

const TabContent = (props: TabPanelProps) => {
  const { children, ...rest } = props;

  return (
    <TabPanel p={0} maxH={"100%"} height={"100%"} overflow={"hidden"} {...rest}>
      {children}
    </TabPanel>
  );
};

export { TabsContainer, TabsPanels, TabContent };
