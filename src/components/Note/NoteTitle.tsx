import { useUserStore } from "@/store/global/userStore";

import { Flex, Icon, Spinner, Text } from "@chakra-ui/react";

import { Tooltip } from "@/components/ui/tooltip-mobile";

import { MdOutlineCheckCircle } from "react-icons/md";
import { useNoteTitle } from "@/util/noteTitle";

interface NoteTitleProps {
  noteType?: string;
  noteKey?: string;
  isSyncing: boolean;
  isSynced: boolean;
  isOutOfSync: boolean;
  isPendingSave: boolean;
}

const NoteTitle = ({
  noteType,
  noteKey,
  isSyncing,
  isSynced,
  isOutOfSync,
  isPendingSave,
}: NoteTitleProps) => {
  const title = useNoteTitle(noteType, noteKey);

  const isLogged = useUserStore((state) => state.isLogged);

  const getSyncTooltip = (): string => {
    if (isPendingSave) return "Note pending save.";
    if (isSyncing) return "Syncing note...";
    if (isOutOfSync) return "Note out of sync.";
    if (isSynced) return "Note synced to the cloud.";

    return "Saved locally. Log in to enable cloud sync.";
  };

  return (
    <Flex dir="auto" alignItems={"center"} gap={"0.2rem"}>
      <Text fontSize="sm" color={"gray.600"} py={"6px"}>
        {title}{" "}
      </Text>
      {isLogged && (
        <Tooltip content={getSyncTooltip()}>
          {isSyncing ? (
            <Spinner size="sm" color="blue.500" />
          ) : (
            <Icon
              as={MdOutlineCheckCircle}
              color={
                isPendingSave
                  ? "gray.500"
                  : isOutOfSync
                  ? "orange.500"
                  : isSynced
                  ? "green.500"
                  : "gray.500"
              }
              boxSize={4}
            />
          )}
        </Tooltip>
      )}
    </Flex>
  );
};

export { NoteTitle };
