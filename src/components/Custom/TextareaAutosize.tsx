import { useEffect, useRef } from "react";

import { useAppSelector } from "@/store";

import { Textarea, TextareaProps } from "@chakra-ui/react";

// snippet below  is from https://github.com/Andarist/react-textarea-autosize

const HIDDEN_TEXTAREA_STYLE = {
  "min-height": "0",
  "max-height": "none",
  height: "0",
  visibility: "hidden",
  overflow: "hidden",
  position: "absolute",
  "z-index": "-1000",
  top: "0",
  right: "0",
} as const;

const forceHiddenStyles = (node: HTMLElement) => {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach((key) => {
    node.style.setProperty(
      key,
      HIDDEN_TEXTAREA_STYLE[key as keyof typeof HIDDEN_TEXTAREA_STYLE],
      "important"
    );
  });
};

// snippet above  is from https://github.com/Andarist/react-textarea-autosize

const TextareaAutosize = (props: TextareaProps) => {
  const refTextarea = useRef<HTMLTextAreaElement>(null);
  const refHidden = useRef<HTMLTextAreaElement>();

  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const minSize = 100;
  const extraSize = 2;

  // Desc: create a hidden clone to use it for height calculations to apply a smooth resize on the original element
  // TODO: an optimization is to create a global element to handle all height calculations instead of creating a dedicated clone for every textarea element
  useEffect(() => {
    if (!refTextarea.current) return;
    if (!refHidden.current) {
      refHidden.current =
        refTextarea.current.cloneNode() as HTMLTextAreaElement;
      refHidden.current.setAttribute("tabindex", "-1");
      refHidden.current.setAttribute("aria-hidden", "true");
      forceHiddenStyles(refHidden.current);
      if (refTextarea.current.parentElement)
        refTextarea.current.parentElement.appendChild(refHidden.current);
    }
  }, []);

  useEffect(() => {
    const elementTextarea = refTextarea.current;
    const hiddenElement = refHidden.current;

    if (!elementTextarea || !hiddenElement) return;

    // Give the hidden element our input and apply a height to update scrollHeight to match content height
    hiddenElement.value = elementTextarea.value;
    hiddenElement.style.height = "auto";

    // We want to make sure that our element auto-resize to match the height of it's content
    elementTextarea.style.height =
      (hiddenElement.scrollHeight < minSize
        ? minSize
        : hiddenElement.scrollHeight + extraSize) + "px";
  }, [props.value]);

  return <Textarea {...props} ref={refTextarea} fontSize={`${notesFS}rem`} />;
};

export default TextareaAutosize;
