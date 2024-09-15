import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "@/store";

import {
  fetchLettersDefinitions,
  fetchLettersPresets,
  lettersPageActions,
} from "@/store/slices/pages/letters";

import { arabicAlphabetDefault } from "@/util/consts";

import LoadingSpinner from "@/components/Generic/LoadingSpinner";

import ModalEditLetter from "@/components/Pages/Letters/ModalEditLetter";
import ModalCreatePreset from "@/components/Pages/Letters/ModalCreatePreset";

import {
  Box,
  Button,
  Flex,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const PanelDefinitions = () => {
  const { t } = useTranslation();

  const {
    isOpen: isOpenCreatePreset,
    onOpen: onOpenCreatePreset,
    onClose: onCloseCreatePreset,
  } = useDisclosure();

  const {
    isOpen: isOpenEditLetter,
    onOpen: onOpenEditLetter,
    onClose: onCloseEditLetter,
  } = useDisclosure();

  const definitionsLoading = useAppSelector(
    (state) => state.lettersPage.definitionsLoading
  );

  const presetsLoading = useAppSelector(
    (state) => state.lettersPage.presetsLoading
  );

  const currentPreset = useAppSelector(
    (state) => state.lettersPage.currentPreset
  );

  const letterPresets = useAppSelector(
    (state) => state.lettersPage.letterPresets
  );

  const dispatch = useAppDispatch();

  const [currentLetter, setCurrentLetter] = useState("");

  const handleClickLetter = (letter: string) => {
    setCurrentLetter(letter);
    onOpenEditLetter();
  };

  const onChangePreset = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(lettersPageActions.setCurrentPreset(event.target.value));
  };

  useEffect(() => {
    dispatch(fetchLettersDefinitions());
    dispatch(fetchLettersPresets());
  }, []);

  if (definitionsLoading || presetsLoading) return <LoadingSpinner />;

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
          {t("letters_preset")}
        </Text>
        <Select
          dir="ltr"
          aria-label="Select"
          value={currentPreset}
          onChange={onChangePreset}
          bgColor={"white"}
        >
          <option value="-1">Default</option>
          {Object.keys(letterPresets).map((presetID) => (
            <option key={presetID} value={presetID}>
              {letterPresets[presetID]}
            </option>
          ))}
        </Select>
        <Button
          bgColor={"black"}
          color={"white"}
          fontWeight={"normal"}
          onClick={onOpenCreatePreset}
        >
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

  const letterDef = useAppSelector(
    (state) => state.lettersPage.lettersDefinitions[defKey]
  ) || { name: "", definition: "" };

  const onClickEdit = (letter: string) => {
    handleClickLetter(letter);
  };

  return (
    <>
      <Box as="span" width={"2rem"} fontSize={"larger"}>
        {letter}
      </Box>
      <Box
        as="span"
        width={"50%"}
        height={"60px"}
        bgColor={"white"}
        borderRadius={"0.3rem"}
        padding={"5px"}
        borderStyle={"solid"}
        borderColor={"rgb(51, 52, 52)"}
        dir={letterDef?.dir || ""}
      >
        {letterDef?.definition || ""}
      </Box>{" "}
      <Button
        colorScheme="blue"
        fontWeight={"normal"}
        onClick={() => onClickEdit(letter)}
      >
        Edit
      </Button>
    </>
  );
};

export default PanelDefinitions;
