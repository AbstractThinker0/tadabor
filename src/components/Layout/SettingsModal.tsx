import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { settingsActions } from "@/store/slices/global/settings";

import {
  Button,
  Box,
  ButtonGroup,
  Heading,
  Separator,
  Stack,
  Dialog,
  DialogOpenChangeDetails,
} from "@chakra-ui/react";

import VerseContainer from "@/components/Custom/VerseContainer";
import { nfsDefault, nfsStored, qfsDefault, qfsStored } from "@/util/consts";

import { Slider } from "@/components/ui/slider";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { ColorModeButton } from "@/components/ui/color-mode";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { i18n } = useTranslation();
  const resolvedLang = i18n.resolvedLanguage;

  const dispatch = useAppDispatch();
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);
  const notesFS = useAppSelector((state) => state.settings.notesFontSize);

  const [orgQuranFS, setOrgQuranFS] = useState(quranFS);
  const [orgNotesFS, setOrgNotesFS] = useState(notesFS);
  const [orgLang, setOrgLang] = useState(resolvedLang);

  const onChangeLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const onChangeQFS = (val: number[]) => {
    dispatch(settingsActions.setQuranFS(val[0]));
  };

  const onChangeNFS = (val: number[]) => {
    dispatch(settingsActions.setNotesFS(val[0]));
  };

  const onClickSave = () => {
    setOrgQuranFS(quranFS);
    localStorage.setItem(qfsStored, String(quranFS));
    setOrgNotesFS(notesFS);
    localStorage.setItem(nfsStored, String(notesFS));
    setOrgLang(resolvedLang);
    onClose();
  };

  const onCloseComplete = () => {
    dispatch(settingsActions.setQuranFS(orgQuranFS));
    dispatch(settingsActions.setNotesFS(orgNotesFS));
    i18n.changeLanguage(orgLang);
  };

  const onClickReset = () => {
    dispatch(settingsActions.setQuranFS(qfsDefault));
    dispatch(settingsActions.setNotesFS(nfsDefault));
    i18n.changeLanguage("ar");
  };

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      onCloseComplete();
    }
  };

  return (
    <Dialog.Root
      size="lg"
      open={isOpen}
      onOpenChange={onOpenChange}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
          fontSize={"2xl"}
        >
          Settings
        </Dialog.Header>

        <Dialog.Body>
          <Stack gap={6} separator={<Separator />}>
            <Box colorPalette="blue" pt={2}>
              <Heading as="span" size="md">
                Language:{" "}
              </Heading>
              <ButtonGroup attached>
                <Button
                  variant={resolvedLang === "en" ? "solid" : "outline"}
                  onClick={() => onChangeLang("en")}
                >
                  English
                </Button>
                <Button
                  variant={resolvedLang === "ar" ? "solid" : "outline"}
                  onClick={() => onChangeLang("ar")}
                >
                  العربية
                </Button>
              </ButtonGroup>
            </Box>
            <Box colorPalette="blue" pt={2}>
              <Heading as="span" size="md">
                Theme:{" "}
              </Heading>
              <ColorModeButton />
            </Box>
            <Box>
              <Box py={1}>
                <Heading size="md">Quran Font Size:</Heading>
                <Slider
                  value={[quranFS]}
                  min={1}
                  max={4}
                  step={0.125}
                  onValueChange={(e) => onChangeQFS(e.value)}
                  colorPalette="blue"
                />
              </Box>
              <Box
                textAlign="center"
                bgColor={"bg.emphasized"}
                borderRadius="0.75rem"
                padding={2}
                lineHeight={"normal"}
              >
                <VerseContainer fontFamily={`"Scheherazade New", serif`}>
                  وَلَتَعْلَمُنَّ نَبَأَهُ بَعْدَ حِينٍ (ص:88)
                </VerseContainer>
              </Box>
            </Box>
            <Box>
              <Box py={1}>
                <Heading size="md">Notes Font Size:</Heading>
                <Slider
                  value={[notesFS]}
                  min={1}
                  max={4}
                  step={0.125}
                  onValueChange={(e) => onChangeNFS(e.value)}
                  colorPalette="blue"
                />
              </Box>
              <Box
                textAlign="center"
                bgColor={"bg.emphasized"}
                borderRadius="0.75rem"
                padding={1}
                fontFamily={`"Scheherazade New", serif`}
                lineHeight={"normal"}
              >
                <span style={{ fontSize: `${notesFS}rem` }}>
                  Note example - مثال كتابة
                </span>
              </Box>
            </Box>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Dialog.ActionTrigger asChild>
              <Button colorPalette="blue" onClick={onClose}>
                Close
              </Button>
            </Dialog.ActionTrigger>
            <Button colorPalette="green" onClick={onClickSave}>
              Save
            </Button>
            <Button colorPalette="yellow" onClick={onClickReset}>
              Reset to defaults
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default SettingsModal;
