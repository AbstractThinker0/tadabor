import { useQuran } from "@/context/useQuran";
import { useTranslation } from "react-i18next";

import { ButtonCopy } from "@/components/Custom/ButtonCopy";

interface ButtonCopyVerseProps {
  verseKey: string;
}

const ButtonCopyVerse = ({ verseKey }: ButtonCopyVerseProps) => {
  const { t } = useTranslation();
  const quranService = useQuran();
  const verseText = quranService.getVerseTextByKey(verseKey);

  const verseRef = quranService.convertKeyToSuffix(verseKey);

  return (
    <ButtonCopy
      copyText={`${verseText} (${verseRef})`}
      copyNotice={t("ui.messages.copied_verse")}
    />
  );
};

export { ButtonCopyVerse };
