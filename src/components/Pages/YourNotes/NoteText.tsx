import { useAppSelector } from "@/store";
import { CardBody, CardFooter, Text } from "@chakra-ui/react";
import { ButtonEdit } from "@/components/Generic/Buttons";

interface NoteTextProps {
  inputValue: string;
  inputDirection: string;
  onClickEditButton: () => void;
}

const NoteText = ({
  inputValue,
  inputDirection,
  onClickEditButton,
}: NoteTextProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  return (
    <>
      <CardBody dir={inputDirection}>
        <Text whiteSpace={"pre-wrap"} fontSize={`${notesFS}rem`}>
          {inputValue}
        </Text>
      </CardBody>
      <CardFooter
        justify={"center"}
        backgroundColor={"rgba(33, 37, 41, .03)"}
        borderTop={"1px solid rgba(0, 0, 0, .175)"}
      >
        <ButtonEdit onClick={onClickEditButton} />
      </CardFooter>
    </>
  );
};

export default NoteText;
