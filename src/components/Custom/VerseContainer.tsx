import { Box, type BoxProps } from "@chakra-ui/react";
import { useAppSelector } from "@/store";

const VerseContainer = (props: BoxProps) => {
  const { children, ...rest } = props;
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);
  const centerVerses = useAppSelector((state) => state.navigation.centerVerses);

  return (
    <Box
      textAlign={centerVerses ? "center" : undefined}
      fontSize={`${quranFS}rem`}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default VerseContainer;
