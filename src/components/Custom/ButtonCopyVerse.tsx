import useQuran from "@/context/useQuran";

import { ButtonCopy } from "@/components/Custom/ButtonCopy";

interface ButtonCopyVerseProps {
  verseKey: string;
}

const ButtonCopyVerse = ({ verseKey }: ButtonCopyVerseProps) => {
  const quranService = useQuran();
  const verseText = quranService.getVerseTextByKey(verseKey);

  const verseRef = quranService.convertKeyToSuffix(verseKey);

  return (
    <ButtonCopy
      copyText={`${verseText} (${verseRef})`}
      copyNotice="Copied verse to clipboard"
    />
  );
};

export { ButtonCopyVerse };
