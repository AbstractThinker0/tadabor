import { memo, useCallback, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { selectNote, useAppDispatch, useAppSelector } from "@/store";
import { verseNotesActions } from "@/store/slices/global/verseNotes";
import { dbFuncs } from "@/util/db";

import { FormComponent, TextComponent } from "@/components/Custom/TextForm";

import { Card, CardBody, Collapse } from "@chakra-ui/react";

interface CollapsibleNoteProps {
  isOpen: boolean;
  verseKey: string;
}

const CollapsibleNote = memo(({ isOpen, verseKey }: CollapsibleNoteProps) => {
  const { t } = useTranslation();
  const currentNote = useAppSelector(selectNote(verseKey));
  const dispatch = useAppDispatch();

  const inputValue = currentNote?.text || "";
  const inputDirection = currentNote?.dir || "";

  const [isEditable, setEditable] = useState(inputValue ? false : true);

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      dispatch(verseNotesActions.changeNote({ name, value }));
    },
    [dispatch]
  );

  const handleInputSubmit = useCallback(
    (key: string, value: string) => {
      dbFuncs
        .saveNote(key, value, inputDirection)
        .then(() => {
          toast.success(t("save_success"));
        })
        .catch(() => {
          toast.error(t("save_failed"));
        });

      setEditable(false);
    },
    [inputDirection]
  );

  const handleSetDirection = useCallback(
    (verse_key: string, dir: string) => {
      dispatch(
        verseNotesActions.changeNoteDir({
          name: verse_key,
          value: dir,
        })
      );
    },
    [dispatch]
  );

  const handleEditClick = useCallback(() => {
    setEditable(true);
  }, []);

  const formRef = useRef<HTMLDivElement>(null);

  const handleEditButtonClick = () => {
    handleEditClick();

    if (formRef.current)
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
  };

  return (
    <Collapse in={isOpen}>
      <Card variant={"outline"} ref={formRef}>
        <CardBody>
          {isEditable === false ? (
            <TextComponent
              inputValue={inputValue}
              handleEditButtonClick={handleEditButtonClick}
              inputKey={verseKey}
              inputDirection={inputDirection}
              textClassname="p-2 border border-1 border-success rounded"
            />
          ) : (
            <FormComponent
              inputKey={verseKey}
              inputValue={inputValue}
              inputDirection={inputDirection}
              handleSetDirection={handleSetDirection}
              handleInputSubmit={handleInputSubmit}
              handleInputChange={handleInputChange}
            />
          )}
        </CardBody>
      </Card>
    </Collapse>
  );
});

export default CollapsibleNote;
