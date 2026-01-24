import { useRef } from "react";

import { useSettingsStore } from "@/store/global/settingsStore";

import { Textarea, type TextareaProps } from "@chakra-ui/react";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";

const TextareaAutosize = (props: TextareaProps) => {
  const refTextarea = useRef<HTMLTextAreaElement>(null);

  const notesFont = useSettingsStore((state) => state.notesFont);
  const notesFS = useSettingsStore((state) => state.notesFontSize);

  const height = useAutosizeTextarea(refTextarea, props.value as string);

  return (
    <Textarea
      ref={refTextarea}
      fontFamily={`${notesFont}, serif`}
      fontSize={`${notesFS}rem`}
      lineHeight={"tall"}
      height={height}
      {...props}
    />
  );
};

export default TextareaAutosize;
