import { ButtonCopy } from "@/components/Custom/ButtonCopy";
import { NoteHistoryDialog } from "@/components/Note/NoteHistoryDialog";
import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface NoteToolsProps {
  noteId?: string;
  dateModified?: number;
  inputValue: string;
}

const NoteTools = ({ noteId, dateModified, inputValue }: NoteToolsProps) => {
  const { t } = useTranslation();

  return (
    <Flex>
      <NoteHistoryDialog noteId={noteId} dateModified={dateModified} />
      <ButtonCopy
        copyText={inputValue}
        copyNotice={t("ui.messages.copied_note")}
      />
    </Flex>
  );
};

export { NoteTools };
