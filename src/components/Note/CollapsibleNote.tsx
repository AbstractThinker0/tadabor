import { CollapsibleGeneric } from "@/components/Generic/CollapsibleGeneric";

import { NoteForm } from "@/components/Note/NoteForm";
import type { NoteType } from "tadabor-shared";

interface CollapsibleNoteProps {
  isOpen: boolean;
  noteId?: string;
  noteType?: NoteType;
  noteKey?: string;
}

const CollapsibleNote = ({
  isOpen,
  noteId,
  noteType,
  noteKey,
}: CollapsibleNoteProps) => {
  return (
    <CollapsibleGeneric isOpen={isOpen}>
      <NoteForm noteId={noteId} noteKey={noteKey} noteType={noteType} />
    </CollapsibleGeneric>
  );
};

export { CollapsibleNote };
