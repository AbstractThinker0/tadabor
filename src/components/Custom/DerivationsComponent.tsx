import type { searchIndexProps } from "quran-tools";

import { Button, HStack, StackSeparator } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip";

interface DerivationsComponentProps {
  handleDerivationClick: (verseKey: string, verseIndex?: number) => void;
  searchIndexes: searchIndexProps[];
}

const DerivationsComponent = ({
  searchIndexes,
  handleDerivationClick,
}: DerivationsComponentProps) => {
  return (
    <HStack
      dir="rtl"
      wrap="wrap"
      p={1}
      separator={<StackSeparator border={"none"}>-</StackSeparator>}
    >
      {searchIndexes.map((root: searchIndexProps, index: number) => (
        <Tooltip showArrow key={index} content={root.text}>
          <Button
            px={2}
            fontSize="xl"
            fontWeight={"600"}
            variant="ghost"
            onClick={() => handleDerivationClick(root.key, index)}
          >{`${root.name}`}</Button>
        </Tooltip>
      ))}
    </HStack>
  );
};

DerivationsComponent.displayName = "DerivationsComponent";

export { DerivationsComponent };
