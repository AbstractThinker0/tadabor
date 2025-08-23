import { useAppDispatch, useAppSelector } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";

import {
  Flex,
  Button,
  Popover,
  Portal,
  Box,
  Separator,
  Heading,
  ButtonGroup,
} from "@chakra-ui/react";

import { LiaToolsSolid } from "react-icons/lia";
import { CloseButton } from "@/components/ui/close-button";
import { useState } from "react";

const DisplayOptionsPopover = () => {
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const centerVerses = useAppSelector((state) => state.navigation.centerVerses);

  const compactVerses = useAppSelector(
    (state) => state.navigation.compactVerses
  );

  const toggleCenterVerses = () => {
    dispatch(navigationActions.toggleCenterVerses());
  };

  const toggleCompactVerses = () => {
    dispatch(navigationActions.toggleCompactVerses());
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
                    <Heading as="span" size="md" w="100px">
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
                    <Heading as="span" size="md" w="100px">
                      Tools:{" "}
                    </Heading>{" "}
                    <ButtonGroup attached colorPalette={"blue"}>
                      <Button
                        variant={!compactVerses ? "solid" : "outline"}
                        onClick={toggleCompactVerses}
                      >
                        Expanded
                      </Button>
                      <Button
                        variant={compactVerses ? "solid" : "outline"}
                        onClick={toggleCompactVerses}
                      >
                        Collapsed
                      </Button>
                    </ButtonGroup>
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
