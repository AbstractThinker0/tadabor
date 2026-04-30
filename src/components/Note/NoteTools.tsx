import { ButtonCopy } from "@/components/Custom/ButtonCopy";
import { NoteHistoryDialog } from "@/components/Note/NoteHistoryDialog";
import { Flex } from "@chakra-ui/react";

interface NoteToolsProps {
  noteId?: string;
  dateModified?: number;
  inputValue: string;
}

const NoteTools = ({ noteId, dateModified, inputValue }: NoteToolsProps) => {
  return (
    <Flex>
      <NoteHistoryDialog noteId={noteId} dateModified={dateModified} />
      <ButtonCopy copyText={inputValue} copyNotice="Copied note to clipboard" />
    </Flex>
  );
};

export { NoteTools };
