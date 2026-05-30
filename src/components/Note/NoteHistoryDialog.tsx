import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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

import { Tooltip } from "@/components/ui/tooltip-mobile";

interface NoteHistoryDialogProps {
  noteId?: string;
  dateModified?: number;
}

const getRelativeTimestamp = (
  timestamp: number,
  relativeTimeFormatter: Intl.RelativeTimeFormat
) => {
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
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [pendingDeleteRevisionId, setPendingDeleteRevisionId] = useState<
    string | null
  >(null);

  const relativeTimeFormatter = useMemo(
    () => new Intl.RelativeTimeFormat(i18n.language, { numeric: "auto" }),
    [i18n.language]
  );
  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [i18n.language]
  );

  const { revisions, isLoading, deleteRevision, clearRevisions } =
    useNoteRevisions({
      noteId,
      refreshKey: dateModified ?? 0,
      isEnabled: true, // previously was isOpen but we need to an indicator to disable the revision button
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
      toaster.error(t("notes.history.delete_failed"));
      return;
    }

    toaster.success(t("notes.history.delete_success"));
  };

  const onClearRevisions = async () => {
    const didClear = await clearRevisions();
    setConfirmClearOpen(false);

    if (!didClear) {
      toaster.error(t("notes.history.clear_failed"));
      return;
    }

    toaster.success(t("notes.history.clear_success"));
  };

  return (
    <>
      <IconButton
        variant="ghost"
        aria-label={t("notes.history.aria_label")}
        marginEnd={"3px"}
        width={"6px"}
        height={"36px"}
        onClick={onOpen}
        disabled={!noteId || revisions.length === 0}
        loading={isLoading}
      >
        {revisions.length === 0 ? (
          <Tooltip content="No recorded revisions for this note yet.">
            <FiClock />
          </Tooltip>
        ) : (
          <FiClock />
        )}
      </IconButton>

      <Dialog.Root
        size="xl"
        open={isOpen}
        onOpenChange={(details) => setIsOpen(details.open)}
        onInteractOutside={onClose}
        placement={"center"}
      >
        <DialogContent dir={i18n.dir()}>
          <Dialog.Header
            borderBottom="1px solid"
            borderColor={"border.emphasized"}
          >
            {t("notes.history.title")}
          </Dialog.Header>

          <Dialog.Body>
            {isLoading ? (
              <Flex justifyContent="center" py={8}>
                <Spinner size="lg" />
              </Flex>
            ) : revisions.length === 0 ? (
              <Box py={8} textAlign="center" color="fg.muted">
                {t("notes.history.empty")}
              </Box>
            ) : (
              <Stack gap={3} separator={<Separator />}>
                {revisions.map((revision) => (
                  <Box key={revision.id} py={1}>
                    <Flex justifyContent="space-between" gap={3}>
                      <Box flex="1">
                        <Text fontSize="sm" color="fg.muted" mb={1}>
                          {dateTimeFormatter.format(
                            new Date(revision.date_created)
                          )}{" "}
                          ({" "}
                          {getRelativeTimestamp(
                            revision.date_created,
                            relativeTimeFormatter
                          )}
                          )
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
                            <Text color="fg.muted">
                              {t("notes.history.empty_note")}
                            </Text>
                          )}
                        </Box>
                      </Box>
                      <IconButton
                        aria-label={t("notes.history.delete_aria_label")}
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
              {t("notes.history.clear_all")}
            </Button>
            <Button colorPalette="blue" onClick={onClose}>
              {t("ui.actions.close")}
            </Button>
          </Dialog.Footer>
          <DialogCloseTrigger onClick={onClose} />
        </DialogContent>
      </Dialog.Root>

      <ConfirmationModal
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={onClearRevisions}
        title={t("notes.history.clear_title")}
        confirmText={t("notes.history.clear_confirm")}
      >
        <Text>{t("notes.history.clear_body")}</Text>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={!!pendingDeleteRevision}
        onClose={() => setPendingDeleteRevisionId(null)}
        onConfirm={() =>
          pendingDeleteRevision && onDeleteRevision(pendingDeleteRevision.id)
        }
        title={t("notes.history.delete_title")}
        confirmText={t("notes.history.delete_confirm")}
      >
        <Stack gap={3}>
          <Text>{t("notes.history.delete_body")}</Text>
          {pendingDeleteRevision && (
            <Text color="fg.muted" fontSize="sm">
              {t("notes.history.revision_date")}{" "}
              {dateTimeFormatter.format(
                new Date(pendingDeleteRevision.date_created)
              )}{" "}
              ({" "}
              {getRelativeTimestamp(
                pendingDeleteRevision.date_created,
                relativeTimeFormatter
              )}
              )
            </Text>
          )}
        </Stack>
      </ConfirmationModal>
    </>
  );
};

export { NoteHistoryDialog };
