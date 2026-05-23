import { useQuran } from "@/context/useQuran";

import { VerseContainer } from "@/components/Custom/VerseContainer";

import { NoteForm } from "@/components/Note/NoteForm";
import { parseNoteId } from "@/util/noteIdentity";

interface NoteComponentProps {
  noteID: string;
}

const NoteComponent = ({ noteID }: NoteComponentProps) => {
  const quranService = useQuran();

  const { type: noteType, key: noteKey } = parseNoteId(noteID);

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
      noteID={noteID}
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
