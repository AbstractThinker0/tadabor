import { useNavigationStore } from "@/store/global/navigationStore";

import {
  Flex,
  Button,
  Popover,
  Portal,
  Box,
  Separator,
  Heading,
  ButtonGroup,
  Switch,
  NativeSelect,
} from "@chakra-ui/react";

import { LiaToolsSolid } from "react-icons/lia";
import { CloseButton } from "@/components/ui/close-button";
import { useState } from "react";

const DisplayOptionsPopover = () => {
  const [open, setOpen] = useState(false);

  const centerVerses = useNavigationStore((state) => state.centerVerses);
  const verseDisplay = useNavigationStore((state) => state.verseDisplay);
  const toolsMode = useNavigationStore((state) => state.toolsMode);
  const toolCopy = useNavigationStore((state) => state.toolCopy);
  const toolNote = useNavigationStore((state) => state.toolNote);
  const toolInspect = useNavigationStore((state) => state.toolInspect);

  const toggleCenterVersesAction = useNavigationStore(
    (state) => state.toggleCenterVerses
  );
  const setVerseDisplayAction = useNavigationStore(
    (state) => state.setVerseDisplay
  );
  const setToolsAction = useNavigationStore((state) => state.setVerseTools);
  const setToolCopyAction = useNavigationStore((state) => state.setToolCopy);
  const setToolNoteAction = useNavigationStore((state) => state.setToolNote);
  const setToolInspectAction = useNavigationStore(
    (state) => state.setToolInspect
  );

  const toggleCenterVerses = () => {
    toggleCenterVersesAction();
  };

  const setVerseDisplay = (mode: string) => {
    setVerseDisplayAction(mode);
  };

  const setToolsMode = (mode: string) => {
    setToolsAction(mode);
  };

  return (
    <Popover.Root
      lazyMount
      unmountOnExit
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Popover.Trigger asChild>
        <Button size="sm" colorPalette="blue">
          <LiaToolsSolid />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />

            <Popover.Body padding={"0"}>
              <CloseButton
                float={"right"}
                size={"sm"}
                onClick={() => setOpen(false)}
              />
              <Box py={4}>
                <Popover.Title
                  px={4}
                  pb={4}
                  fontWeight="medium"
                  fontSize={"large"}
                >
                  Display options:
                </Popover.Title>
                <Separator pb={1} />
                <Box px={4}>
                  {/* */}
                  <Flex py={1} alignItems={"center"}>
                    <Heading as="span" size="md" w="150px">
                      Align:{" "}
                    </Heading>{" "}
                    <ButtonGroup attached colorPalette={"blue"}>
                      <Button
                        variant={centerVerses ? "solid" : "outline"}
                        onClick={toggleCenterVerses}
                      >
                        Center
                      </Button>
                      <Button
                        variant={!centerVerses ? "solid" : "outline"}
                        onClick={toggleCenterVerses}
                      >
                        Right
                      </Button>
                    </ButtonGroup>
                  </Flex>

                  <Flex py={1} alignItems={"center"}>
                    <Heading as="span" size="md" w="150px">
                      Verse Display:{" "}
                    </Heading>{" "}
                    <NativeSelect.Root bgColor={"bg"} width={"120px"}>
                      <NativeSelect.Field
                        onChange={(e) => setVerseDisplay(e.target.value)}
                        value={verseDisplay}
                      >
                        <option value="line">Line</option>
                        <option value="panel">Panel</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Flex>

                  <Flex py={1} alignItems={"center"}>
                    <Heading as="span" size="md" w="150px">
                      Tools Display:{" "}
                    </Heading>{" "}
                    <NativeSelect.Root bgColor={"bg"} width={"120px"}>
                      <NativeSelect.Field
                        onChange={(e) => setToolsMode(e.target.value)}
                        value={toolsMode}
                      >
                        <option value="expanded">Expanded</option>
                        <option value="collapsed">Collapsed</option>
                        <option value="hidden">Hidden</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Flex>

                  <Flex py={1} alignItems={"center"} colorPalette={"blue"}>
                    <Heading as="span" size="md" w="150px">
                      Enabled Tools:
                    </Heading>
                    <Box>
                      {/* Copy Tool */}
                      <Flex alignItems="center" gap={2} py={1}>
                        <Switch.Root
                          checked={toolCopy}
                          onCheckedChange={(e) => setToolCopyAction(e.checked)}
                        >
                          <Switch.HiddenInput />
                          <Switch.Control />
                          <Switch.Label>Copy</Switch.Label>
                        </Switch.Root>
                      </Flex>

                      {/* Note Tool */}
                      <Flex alignItems="center" gap={2} py={1}>
                        <Switch.Root
                          checked={toolNote}
                          onCheckedChange={(e) => setToolNoteAction(e.checked)}
                        >
                          <Switch.HiddenInput />
                          <Switch.Control />
                          <Switch.Label>Note</Switch.Label>
                        </Switch.Root>
                      </Flex>

                      {/* Inspect Tool */}
                      <Flex alignItems="center" gap={2} py={1}>
                        <Switch.Root
                          checked={toolInspect}
                          onCheckedChange={(e) =>
                            setToolInspectAction(e.checked)
                          }
                        >
                          <Switch.HiddenInput />
                          <Switch.Control />
                          <Switch.Label>Inspect</Switch.Label>
                        </Switch.Root>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export { DisplayOptionsPopover };
