import { Box, BoxProps } from "@chakra-ui/react";
import { useAppSelector } from "@/store";

const VerseContainer = (props: BoxProps) => {
  const { children, ...rest } = props;
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);

  return (
    <Box fontSize={`${quranFS}rem`} {...rest}>
      {children}
    </Box>
  );
};

export default VerseContainer;
