import { Clipboard, Button } from "@chakra-ui/react";

import useQuran from "@/context/useQuran";

import { toasterBottomCenter } from "@/components/ui/toaster";

interface ButtonCopyVerseProps {
  verseKey: string;
}

const ButtonCopyVerse = ({ verseKey }: ButtonCopyVerseProps) => {
  const quranService = useQuran();
  const verseText = quranService.getVerseTextByKey(verseKey);

  const verseRef = quranService.convertKeyToSuffix(verseKey);

  const onCopyStatus = ({ copied }: { copied: boolean }) => {
    if (copied) {
      toasterBottomCenter.create({
        type: "success",
        description: "Copied verse to clipboard",
        meta: { center: true },
      });
    }
  };

  return (
    <Clipboard.Root
      value={`${verseText} (${verseRef})`}
      display={"inline"}
      onStatusChange={onCopyStatus}
    >
      <Clipboard.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Clipboard.Indicator />
        </Button>
      </Clipboard.Trigger>
    </Clipboard.Root>
  );
};

export { ButtonCopyVerse };
