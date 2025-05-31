import { CollapsibleGeneric } from "@/components/Generic/CollapsibleGeneric";

import { NoteForm } from "@/components/Note/NoteForm";

interface CollapsibleNoteProps {
  isOpen: boolean;
  noteID?: string;
  noteType?: "verse" | "root" | "translation";
  noteKey?: string;
}

const CollapsibleNote = ({
  isOpen,
  noteID,
  noteType,
  noteKey,
}: CollapsibleNoteProps) => {
  return (
    <CollapsibleGeneric isOpen={isOpen}>
      <NoteForm
        isOpen={isOpen}
        noteID={noteID}
        noteKey={noteKey}
        noteType={noteType}
      />
    </CollapsibleGeneric>
  );
};

export { CollapsibleNote };
