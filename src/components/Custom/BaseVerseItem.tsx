import { useAppSelector } from "@/store";

import { Box, BoxProps } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Custom/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";

import { ButtonExpand } from "@/components/Generic/Buttons";

import { useBoolean } from "usehooks-ts";
import { useState } from "react";

interface BaseVerseItemProps {
  verseKey: string;
  isSelected?: boolean;
  rootProps?: BoxProps;
  children?: React.ReactNode;
  endElement?: React.ReactNode;
  outerStartElement?: React.ReactNode;
  outerEndElement?: React.ReactNode;
}

const BaseVerseItem = ({
  verseKey,
  isSelected,
  children,
  rootProps,
  endElement,
  outerStartElement,
  outerEndElement,
}: BaseVerseItemProps) => {
  const { value: isOpen, toggle } = useBoolean();
  const [isHovered, setIsHovered] = useState(false);

  const compactVerses = useAppSelector(
    (state) => state.navigation.compactVerses
  );

  const shouldShowButtons = !compactVerses || isSelected || isHovered || isOpen;

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      data-id={verseKey}
      py={"0.5rem"}
      px={"1rem"}
      smDown={{ px: "0.2rem" }}
      borderBottom="1px solid"
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rootProps}
    >
      {outerStartElement}
      <VerseContainer>
        {children}
        {shouldShowButtons && (
          <>
            <ButtonExpand onClick={toggle} />
            {endElement}
          </>
        )}
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} inputKey={verseKey} />
      {outerEndElement}
    </Box>
  );
};

export { BaseVerseItem };
