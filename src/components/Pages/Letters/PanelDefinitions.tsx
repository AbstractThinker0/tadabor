import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLettersPageStore } from "@/store/pages/lettersPage";

import { arabicAlphabetDefault } from "@/util/consts";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ModalEditLetter from "@/components/Pages/Letters/ModalEditLetter";
import ModalCreatePreset from "@/components/Pages/Letters/ModalCreatePreset";

import {
  Box,
  Button,
  Flex,
  NativeSelect,
  Span,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const PanelDefinitions = () => {
  const { t } = useTranslation();

  const {
    open: isOpenCreatePreset,
    onOpen: onOpenCreatePreset,
    onClose: onCloseCreatePreset,
  } = useDisclosure();

  const {
    open: isOpenEditLetter,
    onOpen: onOpenEditLetter,
    onClose: onCloseEditLetter,
  } = useDisclosure();

  const definitionsLoading = useLettersPageStore(
    (state) => state.definitionsLoading
  );

  const presetsLoading = useLettersPageStore((state) => state.presetsLoading);

  const currentPreset = useLettersPageStore((state) => state.currentPreset);

  const letterPresets = useLettersPageStore((state) => state.letterPresets);

  const setCurrentPreset = useLettersPageStore(
    (state) => state.setCurrentPreset
  );

  const initializeDefinitions = useLettersPageStore(
    (state) => state.initializeDefinitions
  );

  const initializePresets = useLettersPageStore(
    (state) => state.initializePresets
  );

  const [currentLetter, setCurrentLetter] = useState("");

  const handleClickLetter = (letter: string) => {
    setCurrentLetter(letter);
    onOpenEditLetter();
  };

  const onChangePreset = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPreset(event.target.value);
  };

  useEffect(() => {
    initializeDefinitions();
    initializePresets();
  }, [initializeDefinitions, initializePresets]);

  if (definitionsLoading || presetsLoading)
    return <LoadingSpinner text="Loading definitions" />;

  return (
    <Flex
      flex={1}
      flexDir={"column"}
      overflowY={"scroll"}
      padding={"1rem"}
      maxH={"100%"}
      height={"100%"}
    >
      <Flex
        alignItems={"center"}
        gap={"0.5rem"}
        paddingBottom={"1rem"}
        width={"50%"}
      >
        <Text as="span" fontWeight={"bold"} fontSize={"larger"}>
          {t("letters.preset")}
        </Text>
        <Box>
          <NativeSelect.Root>
            <NativeSelect.Field
              width={"8rem"}
              aria-label="Select"
              value={currentPreset}
              onChange={onChangePreset}
              bgColor={"bg"}
            >
              <option value="-1">Default</option>
              {Object.keys(letterPresets).map((presetID) => (
                <option key={presetID} value={presetID}>
                  {letterPresets[presetID]}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Box>
        <Button fontWeight={"normal"} onClick={onOpenCreatePreset}>
          Create
        </Button>
      </Flex>
      <Flex flexDir={"column"} flexWrap={"wrap"} gap={"1rem"}>
        {arabicAlphabetDefault.map((letter) => (
          <Flex alignItems={"center"} gap={"0.3rem"} key={letter}>
            <ItemLetter
              letter={letter}
              currentPreset={currentPreset}
              handleClickLetter={handleClickLetter}
            />
          </Flex>
        ))}
      </Flex>
      <ModalCreatePreset
        isOpen={isOpenCreatePreset}
        onClose={onCloseCreatePreset}
      />
      <ModalEditLetter
        isOpen={isOpenEditLetter}
        onClose={onCloseEditLetter}
        currentLetter={currentLetter}
        currentPreset={currentPreset}
      />
    </Flex>
  );
};

interface ItemLetterProps {
  letter: string;
  currentPreset: string;
  handleClickLetter: (letter: string) => void;
}

const ItemLetter = ({
  letter,
  currentPreset,
  handleClickLetter,
}: ItemLetterProps) => {
  const defKey = currentPreset === "-1" ? letter : `${letter}:${currentPreset}`;

  const letterDef = useLettersPageStore(
    (state) => state.lettersDefinitions[defKey]
  ) || { name: "", definition: "" };

  const onClickEdit = (letter: string) => {
    handleClickLetter(letter);
  };

  return (
    <>
      <Span width={"2rem"} fontSize={"larger"}>
        {letter}
      </Span>
      <Span
        width={"50%"}
        height={"60px"}
        bgColor={"bg"}
        borderRadius={"0.3rem"}
        padding={"5px"}
        dir={letterDef?.dir || ""}
      >
        {letterDef?.definition || ""}
      </Span>{" "}
      <Button
        colorPalette="blue"
        fontWeight={"normal"}
        onClick={() => onClickEdit(letter)}
      >
        Edit
      </Button>
    </>
  );
};

export default PanelDefinitions;
