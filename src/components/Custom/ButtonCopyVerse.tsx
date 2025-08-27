import { useClipboard, IconButton } from "@chakra-ui/react";

import useQuran from "@/context/useQuran";

import { toasterBottomCenter } from "@/components/ui/toaster";

import { FaRegCopy } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

interface ButtonCopyVerseProps {
  verseKey: string;
}

const ButtonCopyVerse = ({ verseKey }: ButtonCopyVerseProps) => {
  const quranService = useQuran();
  const verseText = quranService.getVerseTextByKey(verseKey);

  const verseRef = quranService.convertKeyToSuffix(verseKey);

  const clipboard = useClipboard({ value: `${verseText} (${verseRef})` });

  const onClickCopy = () => {
    clipboard.copy();
    toasterBottomCenter.create({
      type: "success",
      description: "Copied verse to clipboard",
      meta: { center: true },
    });
  };

  return (
    <IconButton
      colorPalette={clipboard.copied ? "teal" : undefined}
      variant={clipboard.copied ? "solid" : "ghost"}
      size="sm"
      onClick={onClickCopy}
      marginEnd={"3px"}
    >
      {clipboard.copied ? <FaCheck /> : <FaRegCopy />}
    </IconButton>
  );
};

export { ButtonCopyVerse };
