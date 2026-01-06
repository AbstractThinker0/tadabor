import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useSettingsStore } from "@/store/zustand/settingsStore";

import {
  Button,
  Box,
  ButtonGroup,
  Heading,
  Separator,
  Stack,
  Dialog,
  type DialogOpenChangeDetails,
  NativeSelect,
  Flex,
} from "@chakra-ui/react";

import VerseContainer from "@/components/Custom/VerseContainer";
import { NoteText } from "@/components/Note/NoteText";

import {
  fontsList,
  qfDefault,
  qfStored,
  nfDefault,
  nfStored,
  nfsDefault,
  nfsStored,
  qfsDefault,
  qfsStored,
} from "@/util/consts";

import { Slider } from "@/components/ui/slider";
import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useTheme } from "next-themes";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { i18n } = useTranslation();
  const resolvedLang = i18n.resolvedLanguage;

  const quranFont = useSettingsStore((state) => state.quranFont);
  const notesFont = useSettingsStore((state) => state.notesFont);
  const quranFS = useSettingsStore((state) => state.quranFontSize);
  const notesFS = useSettingsStore((state) => state.notesFontSize);
  const setQuranFont = useSettingsStore((state) => state.setQuranFont);
  const setNotesFont = useSettingsStore((state) => state.setNotesFont);
  const setQuranFS = useSettingsStore((state) => state.setQuranFS);
  const setNotesFS = useSettingsStore((state) => state.setNotesFS);

  const [orgQuranFont, setOrgQuranFont] = useState(quranFont);
  const [orgNotesFont, setOrgNotesFont] = useState(notesFont);
  const [orgQuranFS, setOrgQuranFS] = useState(quranFS);
  const [orgNotesFS, setOrgNotesFS] = useState(notesFS);
  const [orgLang, setOrgLang] = useState(resolvedLang);
  const { resolvedTheme, setTheme } = useTheme();
  const [orgColor, setOrgColor] = useState(resolvedTheme);

  const onChangeLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const onChangeQuranFont = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setQuranFont(event.target.value);
  };

  const onChangeNotesFont = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNotesFont(event.target.value);
  };

  const onChangeQFS = (val: number[]) => {
    setQuranFS(val[0]);
  };

  const onChangeNFS = (val: number[]) => {
    setNotesFS(val[0]);
  };

  const onClickSave = () => {
    setOrgQuranFont(quranFont);
    localStorage.setItem(qfStored, quranFont);
    setOrgNotesFont(notesFont);
    localStorage.setItem(nfStored, notesFont);
    setOrgQuranFS(quranFS);
    localStorage.setItem(qfsStored, String(quranFS));
    setOrgNotesFS(notesFS);
    localStorage.setItem(nfsStored, String(notesFS));
    setOrgLang(resolvedLang);
    setOrgColor(resolvedTheme);
    onClose();
  };

  const onCloseComplete = () => {
    setQuranFont(orgQuranFont);
    setNotesFont(orgNotesFont);
    setQuranFS(orgQuranFS);
    setNotesFS(orgNotesFS);
    i18n.changeLanguage(orgLang);
    setTheme(orgColor!);
  };

  const onClickReset = () => {
    setQuranFont(qfDefault);
    setNotesFont(nfDefault);
    setQuranFS(qfsDefault);
    setNotesFS(nfsDefault);
    i18n.changeLanguage("ar");
  };

  const onOpenChange = (details: DialogOpenChangeDetails) => {
    if (!details.open) {
      onCloseComplete();
    }
  };

  return (
    <Dialog.Root
      size="md"
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
          <Stack gap={"0.8rem"} separator={<Separator />}>
            <Box colorPalette="blue" pt={1}>
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
            <Box colorPalette="blue" pt={1}>
              <Heading as="span" size="md">
                Theme:{" "}
              </Heading>
              <ColorModeButton />
            </Box>
            <Flex gap={"0.25rem"} alignItems={"center"}>
              <Heading size="md">Quran Font:</Heading>
              <Box>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    onChange={onChangeQuranFont}
                    value={quranFont}
                    borderRadius={"0.375rem"}
                  >
                    {fontsList.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </Flex>
            <Box>
              <Box py={1}>
                <Heading size="md">Quran Font Size:</Heading>
                <Slider
                  value={[quranFS]}
                  min={0.8}
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
                <VerseContainer displayMode="default" center>
                  وَلَتَعْلَمُنَّ نَبَأَهُ بَعْدَ حِينٍ (ص:88)
                </VerseContainer>
              </Box>
            </Box>
            <Flex gap={"0.25rem"} alignItems={"center"}>
              <Heading size="md">Notes Font:</Heading>
              <Box>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    onChange={onChangeNotesFont}
                    value={notesFont}
                    borderRadius={"0.375rem"}
                  >
                    {fontsList.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </Flex>
            <Box>
              <Box py={1}>
                <Heading size="md">Notes Font Size:</Heading>
                <Slider
                  value={[notesFS]}
                  min={0.8}
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
              >
                <NoteText lineHeight={"normal"}>
                  Note example - مثال كتابة
                </NoteText>
              </Box>
            </Box>
          </Stack>
        </Dialog.Body>
        <Dialog.Footer
          mt={3}
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
