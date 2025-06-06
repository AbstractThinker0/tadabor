import { Box, type BoxProps } from "@chakra-ui/react";
import { useAppSelector } from "@/store";

const VerseContainer = (props: BoxProps) => {
  const { children, ...rest } = props;
  const quranFont = useAppSelector((state) => state.settings.quranFont);
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);
  const centerVerses = useAppSelector((state) => state.navigation.centerVerses);

  return (
    <Box
      fontFamily={`"${quranFont}", serif`}
      fontSize={`${quranFS}rem`}
      textAlign={centerVerses ? "center" : undefined}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default VerseContainer;
