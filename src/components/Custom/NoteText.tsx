import { useAppSelector } from "@/store";
import { Box, type BoxProps } from "@chakra-ui/react";

const NoteText = (props: BoxProps) => {
  const { children, ...rest } = props;

  const notesFont = useAppSelector((state) => state.settings.notesFont);
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <Box
      whiteSpace={"pre-wrap"}
      fontFamily={`${notesFont}, serif`}
      fontSize={`${notesFS}rem`}
      lineHeight={"tall"}
      {...rest}
    >
      {children}
    </Box>
  );
};

export { NoteText };
