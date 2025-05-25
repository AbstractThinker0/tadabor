import { useAppSelector } from "@/store";
import { Span, type SpanProps } from "@chakra-ui/react";

const NoteText = (props: SpanProps) => {
  const { children, ...rest } = props;

  const notesFont = useAppSelector((state) => state.settings.notesFont);
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <Span
      whiteSpace={"pre-wrap"}
      fontFamily={`${notesFont}, serif`}
      fontSize={`${notesFS}rem`}
      lineHeight={"tall"}
      {...rest}
    >
      {children}
    </Span>
  );
};

export { NoteText };
