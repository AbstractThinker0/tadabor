import { CollapsibleGeneric } from "@/components/Generic/CollapsibleGeneric";

import { NoteForm } from "@/components/Note/NoteForm";
import type { NoteType } from "@/util/noteIdentity";

interface CollapsibleNoteProps {
  isOpen: boolean;
  noteID?: string;
  noteType?: NoteType;
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
      <NoteForm noteID={noteID} noteKey={noteKey} noteType={noteType} />
    </CollapsibleGeneric>
  );
};

export { CollapsibleNote };
