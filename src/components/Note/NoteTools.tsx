import { ButtonCopy } from "@/components/Custom/ButtonCopy";
import { Flex } from "@chakra-ui/react";

interface NoteToolsProps {
  inputValue: string;
}

const NoteTools = ({ inputValue }: NoteToolsProps) => {
  return (
    <Flex>
      <ButtonCopy copyText={inputValue} copyNotice="Copied note to clipboard" />
    </Flex>
  );
};

export { NoteTools };
