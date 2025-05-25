import { useRef } from "react";

import { useAppSelector } from "@/store";

import { Textarea, type TextareaProps } from "@chakra-ui/react";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";

const TextareaAutosize = (props: TextareaProps) => {
  const refTextarea = useRef<HTMLTextAreaElement>(null);

  const notesFont = useAppSelector((state) => state.settings.notesFont);
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const height = useAutosizeTextarea(refTextarea, props.value as string);

  return (
    <Textarea
      {...props}
      ref={refTextarea}
      fontFamily={`${notesFont}, serif`}
      fontSize={`${notesFS}rem`}
      lineHeight={"tall"}
      height={height}
    />
  );
};

export default TextareaAutosize;
