import type { searchIndexProps } from "quran-tools";

import { Box, Button, HStack, Spinner, StackSeparator } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";
import { useState, useTransition } from "react";

interface DerivationsComponentProps {
  handleDerivationClick: (verseKey: string, verseIndex?: number) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = ({
  searchIndexes,
  handleDerivationClick,
}: DerivationsComponentProps) => {
  const [itemsCount, setItemsCount] = useState(150);

  const [isPending, startTransition] = useTransition();

  const onScrollOccs = (event: React.UIEvent<HTMLDivElement>) => {
    if (itemsCount >= searchIndexes.length || isPending) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Near the bottom
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      startTransition(() => {
        setItemsCount((state) => Math.min(state + 80, searchIndexes.length));
      });
    }
  };

  return (
    <HStack
      border={"1px solid"}
      dir="rtl"
      wrap="wrap"
      padding={3}
      margin={1}
      maxH={"400px"}
      overflowY={"scroll"}
      onScroll={onScrollOccs}
      separator={<StackSeparator border={"none"}>-</StackSeparator>}
    >
      {searchIndexes
        .slice(0, itemsCount)
        .map((root: searchIndexProps, index: number) => (
          <Tooltip showArrow key={index} content={root.text}>
            <Button
              px={2}
              fontSize="xl"
              fontWeight={"600"}
              variant="ghost"
              userSelect={"text"}
              onClick={() => handleDerivationClick(root.key, index)}
            >{`${root.name}`}</Button>
          </Tooltip>
        ))}

      {isPending && (
        <Box width={"100%"} textAlign={"center"} py={5}>
          <Spinner size="sm" borderWidth="2px" margin="auto" color="blue.500" />
        </Box>
      )}
    </HStack>
  );
};

DerivationsComponent.displayName = "DerivationsComponent";

export { DerivationsComponent };
