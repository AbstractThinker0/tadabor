import { NativeSelect } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { reciters } from "@/util/reciters";
import { useAudioPlayerStore } from "@/store/global/audioPlayerStore";

const ReciterSelect = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const currentReciter = useAudioPlayerStore((state) => state.currentReciter);
  const setCurrentReciter = useAudioPlayerStore(
    (state) => state.setCurrentReciter
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentReciter(e.target.value);
  };

  return (
    <NativeSelect.Root size="sm" bgColor="bg" width="auto">
      <NativeSelect.Field value={currentReciter} onChange={handleChange}>
        {reciters.map((reciter) => (
          <option key={reciter.id} value={reciter.id}>
            {isArabic ? reciter.nameAr : reciter.nameEn}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
};

export default ReciterSelect;
