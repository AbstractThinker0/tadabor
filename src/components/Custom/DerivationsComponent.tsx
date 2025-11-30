import type { searchIndexProps } from "quran-tools";

import {
  Box,
  Button,
  HStack,
  Spinner,
  StackSeparator,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";
import { useMemo, useState, useTransition } from "react";

interface DerivationsComponentProps {
  handleDerivationClick: (verseKey: string, verseIndex?: number) => void;
  searchIndexes: searchIndexProps[];
}

interface IndexedDerivation {
  derivation: searchIndexProps;
  originalIndex: number;
}

interface GroupedDerivation {
  name: string;
  items: IndexedDerivation[];
}

const DerivationsComponent = ({
  searchIndexes,
  handleDerivationClick,
}: DerivationsComponentProps) => {
  const [itemsCount, setItemsCount] = useState(200);
  const [hideDuplicates, setHideDuplicates] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const [isPending, startTransition] = useTransition();

  // Create indexed list for non-grouped view
  const displayItems: IndexedDerivation[] = useMemo(() => {
    return searchIndexes.map((derivation, originalIndex) => ({
      derivation,
      originalIndex,
    }));
  }, [searchIndexes]);

  // Create grouped list for collapsible view
  const groupedItems: GroupedDerivation[] = useMemo(() => {
    const groups = new Map<string, IndexedDerivation[]>();

    for (let i = 0; i < searchIndexes.length; i++) {
      const derivation = searchIndexes[i];
      const existing = groups.get(derivation.name);
      if (existing) {
        existing.push({ derivation, originalIndex: i });
      } else {
        groups.set(derivation.name, [{ derivation, originalIndex: i }]);
      }
    }

    return Array.from(groups.entries()).map(([name, items]) => ({
      name,
      items,
    }));
  }, [searchIndexes]);

  const onScrollOccs = (event: React.UIEvent<HTMLDivElement>) => {
    const currentLength = hideDuplicates
      ? groupedItems.length
      : displayItems.length;
    if (itemsCount >= currentLength || isPending) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Near the bottom
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      startTransition(() => {
        setItemsCount((state) => Math.min(state + 80, currentLength));
      });
    }
  };

  const uniqueCount = useMemo(() => {
    const seen = new Set<string>();
    for (const item of searchIndexes) {
      seen.add(item.name);
    }
    return seen.size;
  }, [searchIndexes]);

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <Box border={"1px solid"} borderRadius={"md"} margin={2} overflow="hidden">
      <HStack justifyContent="space-between" px={2} pt={1}>
        <Text fontSize="xs" color="fg.muted">
          {hideDuplicates
            ? `${uniqueCount} unique`
            : `${searchIndexes.length} (${uniqueCount} unique)`}
        </Text>
        <Switch.Root
          size="sm"
          checked={hideDuplicates}
          onCheckedChange={(e) => setHideDuplicates(e.checked)}
        >
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>
            <Text fontSize="xs">Hide duplicates</Text>
          </Switch.Label>
        </Switch.Root>
      </HStack>
      <HStack
        dir="rtl"
        wrap="wrap"
        padding={2.5}
        maxH={"400px"}
        overflowY={"scroll"}
        onScroll={onScrollOccs}
        separator={
          hideDuplicates ? undefined : (
            <StackSeparator border={"none"}>-</StackSeparator>
          )
        }
      >
        {hideDuplicates
          ? groupedItems.slice(0, itemsCount).map((group, groupIndex) => {
              const isExpanded = expandedGroups.has(group.name);
              const hasMultiple = group.items.length > 1;
              const firstItem = group.items[0];

              return (
                <HStack key={group.name} gap={0}>
                  {groupIndex > 0 && <Text color="fg.muted">-</Text>}
                  <VStack gap={0} align="stretch">
                    <Tooltip
                      showArrow
                      content={
                        hasMultiple
                          ? `${group.items.length} occurrences`
                          : firstItem.derivation.text
                      }
                    >
                      <Button
                        px={2}
                        fontSize="xl"
                        fontWeight={"600"}
                        variant="ghost"
                        userSelect={"text"}
                        onClick={() => {
                          if (hasMultiple) {
                            toggleGroup(group.name);
                          } else {
                            handleDerivationClick(
                              firstItem.derivation.key,
                              firstItem.originalIndex
                            );
                          }
                        }}
                      >
                        {group.name}
                        {hasMultiple && (
                          <Text as="span" fontSize="xs" color="fg.muted" ms={1}>
                            ({group.items.length})
                          </Text>
                        )}
                      </Button>
                    </Tooltip>
                    {isExpanded && (
                      <VStack
                        gap={0}
                        ps={2}
                        borderStart="2px solid"
                        borderColor="border.muted"
                      >
                        {group.items.map(({ derivation, originalIndex }) => (
                          <Tooltip
                            showArrow
                            key={originalIndex}
                            content={derivation.text}
                          >
                            <Button
                              px={2}
                              fontSize="md"
                              fontWeight={"500"}
                              variant="ghost"
                              userSelect={"text"}
                              onClick={() =>
                                handleDerivationClick(
                                  derivation.key,
                                  originalIndex
                                )
                              }
                            >
                              {derivation.text}
                            </Button>
                          </Tooltip>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </HStack>
              );
            })
          : displayItems
              .slice(0, itemsCount)
              .map(({ derivation, originalIndex }) => (
                <Tooltip
                  showArrow
                  key={originalIndex}
                  content={derivation.text}
                >
                  <Button
                    px={2}
                    fontSize="xl"
                    fontWeight={"600"}
                    variant="ghost"
                    userSelect={"text"}
                    onClick={() =>
                      handleDerivationClick(derivation.key, originalIndex)
                    }
                  >{`${derivation.name}`}</Button>
                </Tooltip>
              ))}

        {isPending && (
          <Box width={"100%"} textAlign={"center"} py={5}>
            <Spinner
              size="sm"
              borderWidth="2px"
              margin="auto"
              color="blue.500"
            />
          </Box>
        )}
      </HStack>
    </Box>
  );
};

DerivationsComponent.displayName = "DerivationsComponent";

export { DerivationsComponent };
