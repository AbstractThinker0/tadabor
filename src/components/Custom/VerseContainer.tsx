import { Box, type BoxProps } from "@chakra-ui/react";
import { useSettingsStore } from "@/store/zustand/settingsStore";
import { useNavigationStore } from "@/store/zustand/navigationStore";

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
  const quranFont = useSettingsStore((state) => state.quranFont);
  const quranFS = useSettingsStore((state) => state.quranFontSize);
  const centerVerses = useNavigationStore((state) => state.centerVerses);
  const verseDisplay = useNavigationStore((state) => state.verseDisplay);

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
