import { useRef } from "react";

import { useAppSelector } from "@/store";

import { Textarea, type TextareaProps } from "@chakra-ui/react";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";

const TextareaAutosize = (props: TextareaProps) => {
  const refTextarea = useRef<HTMLTextAreaElement>(null);

  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const height = useAutosizeTextarea(refTextarea, props.value as string);

  return (
    <Textarea
      {...props}
      ref={refTextarea}
      fontSize={`${notesFS}rem`}
      height={height}
    />
  );
};

export default TextareaAutosize;
