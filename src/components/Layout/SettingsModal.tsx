import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { settingsActions } from "@/store/slices/global/settings";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  Box,
  ButtonGroup,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Heading,
  Divider,
  Stack,
  StackItem,
} from "@chakra-ui/react";

import VerseContainer from "@/components/Custom/VerseContainer";
import { nfsDefault, nfsStored, qfsDefault, qfsStored } from "@/util/consts";

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

  const onChangeQFS = (val: number) => {
    dispatch(settingsActions.setQuranFS(val));
  };

  const onChangeNFS = (val: number) => {
    dispatch(settingsActions.setNotesFS(val));
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

  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={onCloseComplete}
      isCentered
    >
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6} divider={<Divider />}>
            <StackItem>
              <Heading as="span" size="sm">
                Language:{" "}
              </Heading>
              <ButtonGroup colorScheme="blue" isAttached>
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
            </StackItem>
            <StackItem>
              <Box py={1}>
                <Heading size="sm">Quran Font Size:</Heading>
                <Slider
                  value={quranFS}
                  min={1}
                  max={4}
                  step={0.125}
                  onChange={onChangeQFS}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>
              <Box
                textAlign="center"
                backgroundColor={"rgb(201, 201, 201)"}
                borderRadius="0.75rem"
                padding={2}
              >
                <VerseContainer>
                  وَلَتَعْلَمُنَّ نَبَأَهُ بَعْدَ حِينٍ (ص:88)
                </VerseContainer>
              </Box>
            </StackItem>
            <StackItem>
              <Box py={1}>
                <Heading size="sm">Notes Font Size:</Heading>
                <Slider
                  value={notesFS}
                  min={1}
                  max={4}
                  step={0.125}
                  onChange={onChangeNFS}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
              </Box>
              <Box
                textAlign="center"
                backgroundColor={"rgb(201, 201, 201)"}
                borderRadius="0.75rem"
                padding={2}
              >
                <span style={{ fontSize: `${notesFS}rem` }}>
                  Note example - مثال كتابة
                </span>
              </Box>
            </StackItem>
          </Stack>
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={onClickSave}>
              Save
            </Button>
            <Button colorScheme="yellow" onClick={onClickReset}>
              Reset to defaults
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
