import { useAppSelector } from "@/store";

import { Box, Flex, Icon, Spinner, Text } from "@chakra-ui/react";
import { ButtonEdit, ButtonSave } from "@/components/Generic/Buttons";

import { MdOutlineCheckCircle } from "react-icons/md";
import { Tooltip } from "../ui/tooltip";

interface NoteContainerProps {
  isSynced: boolean;
  isSyncing: boolean;
  inputValue: string;
  inputDirection: string;
  inputSaved?: boolean;
  onClickEditButton: () => void;
  onSubmitForm: (event: React.FormEvent<HTMLDivElement>) => void;
}

const NoteContainer = ({
  isSynced,
  isSyncing,
  inputValue,
  inputDirection,
  inputSaved = true,
  onClickEditButton,
  onSubmitForm,
}: NoteContainerProps) => {
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const getSyncTooltip = (isSyncing: boolean, isSynced: boolean): string => {
    if (isSyncing) return "Syncing note...";
    if (isSynced) return "Note is synced to the cloud.";
    return "Saved locally. Log in to enable cloud sync.";
  };

  return (
    <Box
      as="form"
      onSubmit={onSubmitForm}
      px={"0.5rem"}
      pb={"0.5rem"}
      pt={"3rem"}
    >
      <Box
        py={2}
        px={3}
        mb={2}
        border={"1px solid"}
        borderColor={inputSaved ? "green.solid" : "yellow.solid"}
        borderRadius={"2xl"}
        position="relative"
      >
        {/* Top-right indicator */}
        <Box position="absolute" top="-8px" insetEnd="0.3rem">
          <Tooltip content={getSyncTooltip(isSyncing, isSynced)}>
            {isSyncing ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <Icon
                as={MdOutlineCheckCircle}
                color={isSynced ? "green.500" : "gray.500"}
                boxSize={4}
              />
            )}
          </Tooltip>
        </Box>
        <Text
          whiteSpace={"pre-wrap"}
          fontSize={`${notesFS}rem`}
          dir={inputDirection}
          mb={"5.5rem"}
        >
          {inputValue}
        </Text>
      </Box>
      <Flex justifyContent={"center"} gap={"1rem"}>
        <ButtonEdit onClick={onClickEditButton} />
        {!inputSaved && <ButtonSave />}
      </Flex>
    </Box>
  );
};

export default NoteContainer;
