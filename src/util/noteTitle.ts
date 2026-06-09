import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuran } from "@/context/useQuran";
import type { NoteType } from "tadabor-shared";

export const useNoteTitle = (
  noteType?: NoteType | string,
  noteKey?: string
): string => {
  const { t } = useTranslation();
  const quranService = useQuran();

  return useMemo(() => {
    if (!noteType || !noteKey) return "";

    if (noteType === "verse") {
      return `${t("notes.noteVerse")} (${quranService.convertKeyToSuffix(
        noteKey
      )})`;
    }

    if (noteType === "root") {
      const rootName = quranService.getRootNameByID(noteKey) || noteKey;
      return `${t("notes.noteRoot")} (${rootName})`;
    }

    if (noteType === "translation") {
      return `${t("notes.translationVerse")} (${quranService.convertKeyToSuffix(
        noteKey
      )})`;
    }

    return "";
  }, [noteType, noteKey, quranService, t]);
};
