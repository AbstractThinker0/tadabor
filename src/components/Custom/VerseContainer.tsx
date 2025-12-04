import { Box, type BoxProps } from "@chakra-ui/react";
import { useAppSelector } from "@/store";

interface VerseContainerProps extends BoxProps {
  center?: boolean;
  displayMode?: "panel" | "default";
}

const VerseContainer = ({
  children,
  center,
  displayMode,
  ...rest
}: VerseContainerProps) => {
  const quranFont = useAppSelector((state) => state.settings.quranFont);
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);
  const centerVerses = useAppSelector((state) => state.navigation.centerVerses);
  const verseDisplay = useAppSelector((state) => state.navigation.verseDisplay);

  const isCentered = center !== undefined ? center : centerVerses;
  const isPanel =
    displayMode !== undefined
      ? displayMode === "panel"
      : verseDisplay === "panel";

  return (
    <Box
      fontFamily={`"${quranFont}", serif`}
      fontSize={`${quranFS}rem`}
      textAlign={isCentered ? "center" : undefined}
      display={isPanel ? "flex" : undefined}
      alignItems={isPanel ? "center" : undefined}
      justifyContent={
        isPanel ? "space-between" : isCentered ? "center" : undefined
      }
      {...rest}
    >
      {children}
    </Box>
  );
};

export default VerseContainer;
