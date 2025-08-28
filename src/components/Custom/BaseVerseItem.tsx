import { useAppSelector } from "@/store";

import { Box, type BoxProps } from "@chakra-ui/react";

import { CollapsibleNote } from "@/components/Note/CollapsibleNote";
import VerseContainer from "@/components/Custom/VerseContainer";
import { ButtonCopyVerse } from "@/components/Custom/ButtonCopyVerse";

import { ButtonExpand } from "@/components/Generic/Buttons";

import { useBoolean } from "usehooks-ts";
import { useState } from "react";

interface BaseVerseItemProps {
  noteType?: "verse" | "translation";
  defaultOpen?: boolean;
  dataKey?: string;
  verseKey: string;
  isSelected?: boolean;
  rootProps?: BoxProps;
  children?: React.ReactNode;
  endElement?: React.ReactNode;
  outerStartElement?: React.ReactNode;
  outerEndElement?: React.ReactNode;
}

const BaseVerseItem = ({
  noteType = "verse",
  defaultOpen,
  dataKey,
  verseKey,
  isSelected,
  children,
  rootProps,
  endElement,
  outerStartElement,
  outerEndElement,
}: BaseVerseItemProps) => {
  const { value: isOpen, toggle } = useBoolean(defaultOpen);
  const [isHovered, setIsHovered] = useState(false);

  const toolsMode = useAppSelector((state) => state.navigation.toolsMode);

  const shouldShowButtons =
    isSelected ||
    isOpen ||
    (toolsMode !== "hidden" && (toolsMode === "expanded" || isHovered));

  const toolCopy = useAppSelector((state) => state.navigation.toolCopy);
  const toolNote = useAppSelector((state) => state.navigation.toolNote);

  const onMouseEnter = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      data-id={dataKey ? dataKey : verseKey}
      py={"0.5rem"}
      px={"1rem"}
      smDown={{ px: "0.2rem" }}
      borderBottom="1px solid"
      borderColor={"border.emphasized"}
      aria-selected={isSelected}
      _selected={{ bgColor: "orange.muted" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      lineHeight={"normal"}
      {...rootProps}
    >
      {outerStartElement}
      <VerseContainer>
        {children}
        {shouldShowButtons && (
          <>
            {toolNote && (
              <ButtonExpand
                onClick={toggle}
                variant={isOpen ? "solid" : "ghost"}
                colorPalette={isOpen ? "teal" : undefined}
                marginEnd={"3px"}
              />
            )}
            {toolCopy && <ButtonCopyVerse verseKey={verseKey} />}
            {endElement}
          </>
        )}
      </VerseContainer>
      <CollapsibleNote isOpen={isOpen} noteType={noteType} noteKey={verseKey} />
      {outerEndElement}
    </Box>
  );
};

export { BaseVerseItem };
