import { memo, useState } from "react";

import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector, selectTransNote } from "@/store";
import useQuran from "@/context/useQuran";

import { dbFuncs } from "@/util/db";
import { toast } from "react-toastify";
import { transNotesActions } from "@/store/slices/global/transNotes";

import VerseContainer from "@/components/Custom/VerseContainer";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  Text,
} from "@chakra-ui/react";
import TextareaAutosize from "@/components/Custom/TextareaAutosize";
import { ButtonSave } from "@/components/Generic/Buttons";

interface TransComponentProps {
  verseKey: string;
}

const TransComponent = ({ verseKey }: TransComponentProps) => {
  const quranService = useQuran();

  return (
    <Card w={"100%"} variant={"outline"} borderColor={"rgba(0, 0, 0, .175)"}>
      <CardHeader
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderBottom={"1px solid rgba(0, 0, 0, .175)"}
        dir="rtl"
      >
        <VerseContainer>
          ({quranService.convertKeyToSuffix(verseKey)}) <br />{" "}
          {quranService.getVerseTextByKey(verseKey)}{" "}
        </VerseContainer>
      </CardHeader>
      <TransBody inputKey={verseKey} />
    </Card>
  );
};

interface TransBodyProps {
  inputKey: string;
}

const TransBody = memo(({ inputKey }: TransBodyProps) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const verse_trans = useAppSelector(selectTransNote(inputKey));

  const [isEditable, setEditable] = useState(verse_trans ? false : true);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleInputSubmit = (inputValue: string) => {
    setEditable(false);

    dbFuncs
      .saveTranslation(inputKey, inputValue)
      .then(() => {
        toast.success(t("save_success"));
      })
      .catch(() => {
        toast.error(t("save_failed"));
      });
  };

  const handleInputChange = (value: string) => {
    dispatch(
      transNotesActions.changeTranslation({
        name: inputKey,
        value: value,
      })
    );
  };

  return (
    <>
      {isEditable === false ? (
        <Versetext inputValue={verse_trans} handleEditClick={handleEditClick} />
      ) : (
        <Versearea
          inputValue={verse_trans}
          handleInputChange={handleInputChange}
          handleInputSubmit={handleInputSubmit}
        />
      )}
    </>
  );
});

TransBody.displayName = "TransBody";

interface VersetextProps {
  inputValue: string;
  handleEditClick: () => void;
}

const Versetext = ({ inputValue, handleEditClick }: VersetextProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <>
      <CardBody dir="ltr">
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`}>
          {inputValue}
        </Text>
      </CardBody>
      <CardFooter
        justify={"center"}
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderTop={"1px solid rgba(0, 0, 0, .175)"}
      >
        <ButtonSave onClick={handleEditClick} />
      </CardFooter>
    </>
  );
};

interface VerseareaProps {
  inputValue: string;
  handleInputChange: (value: string) => void;
  handleInputSubmit: (inputValue: string) => void;
}

const Versearea = ({
  inputValue,
  handleInputChange,
  handleInputSubmit,
}: VerseareaProps) => {
  const onSubmit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();

    handleInputSubmit(inputValue);
  };

  const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(event.target.value);
  };

  return (
    <FormControl as="form" onSubmit={onSubmit} dir="ltr">
      <TextareaAutosize
        value={inputValue}
        onChange={onChangeTextarea}
        lineHeight={"normal"}
        placeholder={"Enter your text."}
        isRequired
      />
      <CardFooter
        justify={"center"}
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderTop={"1px solid rgba(0, 0, 0, .175)"}
      >
        <ButtonSave />
      </CardFooter>
    </FormControl>
  );
};

export default TransComponent;
