import { useLayoutEffect, useState } from "react";

// Singleton hidden textarea
let globalHiddenTextarea: HTMLTextAreaElement | null = null;

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
  display: "block",
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

const cloneRef = (referenceElement: HTMLElement) => {
  if (globalHiddenTextarea) {
    if (globalHiddenTextarea.parentNode) {
      globalHiddenTextarea.parentNode.removeChild(globalHiddenTextarea);
    }
    globalHiddenTextarea = null; // Clear reference
  }

  const el = referenceElement.cloneNode() as HTMLTextAreaElement;
  el.setAttribute("tabindex", "-1");
  el.setAttribute("aria-hidden", "true");
  forceHiddenStyles(el);
  globalHiddenTextarea = el;
};

const getOrCreateGlobalHiddenTextarea = (referenceElement: HTMLElement) => {
  const parent = referenceElement.parentElement;

  if (!parent) return null;

  if (!globalHiddenTextarea || globalHiddenTextarea.parentElement !== parent) {
    cloneRef(referenceElement);
    parent.appendChild(globalHiddenTextarea!);
  }

  return globalHiddenTextarea!;
};

export const useAutosizeTextarea = (
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  minHeight = 100,
  extraSize = 50
) => {
  const [height, setHeight] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;

    const hidden = getOrCreateGlobalHiddenTextarea(textarea);

    if (!hidden) return;

    hidden.value = value;
    hidden.style.height = "auto";

    const newHeight = `${Math.max(
      hidden.scrollHeight + extraSize,
      minHeight
    )}px`;

    setHeight(newHeight);
  }, [value]);

  return height;
};
