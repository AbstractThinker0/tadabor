import { useQuran } from "@/context/useQuran";

import { VerseContainer } from "@/components/Custom/VerseContainer";

import { NoteForm } from "@/components/Note/NoteForm";
import { parseNoteId } from "tadabor-shared";

interface NoteComponentProps {
  noteId: string;
}

const NoteComponent = ({ noteId }: NoteComponentProps) => {
  const quranService = useQuran();

  const { type: noteType, key: noteKey } = parseNoteId(noteId);

  const renderNoteHeader = () => {
    if (noteType === "root") {
      return quranService.getRootNameByID(noteKey);
    }

    return (
      <>
        ({quranService.convertKeyToSuffix(noteKey)}) <br />
        {quranService.getVerseTextByKey(noteKey)}
      </>
    );
  };

  return (
    <NoteForm
      noteId={noteId}
      renderHeader={
        <VerseContainer displayMode="default" center>
          {renderNoteHeader()}
        </VerseContainer>
      }
      rootProps={{ shadow: "sm" }}
    />
  );
};

export { NoteComponent };
