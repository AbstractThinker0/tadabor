import { useSettingsStore } from "@/store/zustand/settingsStore";
import { Box, type BoxProps } from "@chakra-ui/react";

const NoteText = (props: BoxProps) => {
  const { children, ...rest } = props;

  const notesFont = useSettingsStore((state) => state.notesFont);
  const notesFS = useSettingsStore((state) => state.notesFontSize);

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
