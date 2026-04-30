import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  Flex,
  IconButton,
  Separator,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

import { ConfirmationModal } from "@/components/Generic/ConfirmationModal";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { useNoteRevisions } from "@/hooks/useNoteRevisions";
import { toaster } from "@/components/ui/toaster";

import { FiClock, FiTrash2 } from "react-icons/fi";
import { useSettingsStore } from "@/store/global/settingsStore";

interface NoteHistoryDialogProps {
  noteId?: string;
  dateModified?: number;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

const getRelativeTimestamp = (timestamp: number) => {
  const diffMs = timestamp - Date.now();
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < 60_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 1000), "second");
  }

  if (absDiffMs < 3_600_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 60_000), "minute");
  }

  if (absDiffMs < 86_400_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 3_600_000), "hour");
  }

  if (absDiffMs < 2_592_000_000) {
    return relativeTimeFormatter.format(Math.round(diffMs / 86_400_000), "day");
  }

  if (absDiffMs < 31_536_000_000) {
    return relativeTimeFormatter.format(
      Math.round(diffMs / 2_592_000_000),
      "month"
    );
  }

  return relativeTimeFormatter.format(
    Math.round(diffMs / 31_536_000_000),
    "year"
  );
};

const NoteHistoryDialog = ({
  noteId,
  dateModified,
}: NoteHistoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingDeleteRevisionId, setPendingDeleteRevisionId] = useState<
    string | null
  >(null);

  const { revisions, isLoading, deleteRevision, clearRevisions } =
    useNoteRevisions({
      noteId,
      refreshKey: dateModified ?? 0,
      isEnabled: isOpen,
    });

  const notesFont = useSettingsStore((state) => state.notesFont);

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const pendingDeleteRevision = revisions.find(
    (revision) => revision.id === pendingDeleteRevisionId
  );

  const onDeleteRevision = async (revisionId: string) => {
    const didDelete = await deleteRevision(revisionId);

    setPendingDeleteRevisionId(null);

    if (!didDelete) {
      toaster.create({
        description: "Failed to delete revision",
        type: "error",
      });
      return;
    }

    toaster.create({
      description: "Revision deleted",
      type: "success",
    });
  };

  const onClearRevisions = async () => {
    const didClear = await clearRevisions();
    setConfirmClearOpen(false);

    if (!didClear) {
      toaster.create({
        description: "Failed to clear note history",
        type: "error",
      });
      return;
    }

    toaster.create({
      description: "Note history cleared",
      type: "success",
    });
  };

  return (
    <>
      <IconButton
        variant="ghost"
        aria-label="Note history"
        marginEnd={"3px"}
        width={"6px"}
        height={"36px"}
        onClick={onOpen}
        disabled={!noteId}
      >
        <FiClock />
      </IconButton>

      <Dialog.Root
        size="xl"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        onInteractOutside={onClose}
        placement={"center"}
      >
        <DialogContent>
          <Dialog.Header
            borderBottom="1px solid"
            borderColor={"border.emphasized"}
          >
            Note history
          </Dialog.Header>

          <Dialog.Body>
            {isLoading ? (
              <Flex justifyContent="center" py={8}>
                <Spinner size="lg" />
              </Flex>
            ) : revisions.length === 0 ? (
              <Box py={8} textAlign="center" color="fg.muted">
                No note history yet.
              </Box>
            ) : (
              <Stack gap={3} separator={<Separator />}>
                {revisions.map((revision) => (
                  <Box key={revision.id} py={1}>
                    <Flex justifyContent="space-between" gap={3}>
                      <Box flex="1">
                        <Text fontSize="sm" color="fg.muted" mb={1}>
                          {new Date(revision.date_created).toLocaleString()} ({" "}
                          {getRelativeTimestamp(revision.date_created)})
                        </Text>
                        <Box
                          px={3}
                          py={2}
                          border="1px solid"
                          borderColor="border"
                          borderRadius="xl"
                          bgColor="bg.muted"
                          dir={revision.dir || ""}
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                          fontFamily={`${notesFont}, serif`}
                        >
                          {revision.text || (
                            <Text color="fg.muted">Empty note</Text>
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        aria-label="Delete revision"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => setPendingDeleteRevisionId(revision.id)}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            )}
          </Dialog.Body>

          <Dialog.Footer
            mt={5}
            justifyContent="space-between"
            borderTop="1px solid"
            borderColor={"border.emphasized"}
          >
            <Button
              colorPalette="red"
              variant="outline"
              onClick={() => setConfirmClearOpen(true)}
              disabled={revisions.length === 0}
            >
              Clear all
            </Button>
            <Button colorPalette="blue" onClick={onClose}>
              Close
            </Button>
          </Dialog.Footer>
          <DialogCloseTrigger onClick={onClose} />
        </DialogContent>
      </Dialog.Root>

      <ConfirmationModal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={onClearRevisions}
        title="Clear note history"
        confirmText="Clear history"
      >
        <Text>This removes all saved revisions for this note.</Text>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={!!pendingDeleteRevision}
        onClose={() => setPendingDeleteRevisionId(null)}
        onConfirm={() =>
          pendingDeleteRevision && onDeleteRevision(pendingDeleteRevision.id)
        }
        title="Delete revision"
        confirmText="Delete revision"
      >
        <Stack gap={3}>
          <Text>This removes this revision from local note history.</Text>
          {pendingDeleteRevision && (
            <Text color="fg.muted" fontSize="sm">
              Revision date:{" "}
              {new Date(pendingDeleteRevision.date_created).toLocaleString()} ({" "}
              {getRelativeTimestamp(pendingDeleteRevision.date_created)})
            </Text>
          )}
        </Stack>
      </ConfirmationModal>
    </>
  );
};

export { NoteHistoryDialog };
