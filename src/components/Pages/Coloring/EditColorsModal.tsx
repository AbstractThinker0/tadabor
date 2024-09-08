import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import { coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Button,
  ButtonGroup,
  Input,
  Flex,
  Select,
} from "@chakra-ui/react";

interface EditColorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditColorsModal = ({ isOpen, onClose }: EditColorModalProps) => {
  const colorsList = useAppSelector((state) => state.coloringPage.colorsList);
  const coloredVerses = useAppSelector(
    (state) => state.coloringPage.coloredVerses
  );

  const dispatch = useAppDispatch();

  const [listColors, setListColors] = useState({ ...colorsList });
  const [currentColor, setCurrentColor] = useState(
    Object.keys(colorsList).length
      ? colorsList[Object.keys(colorsList)[0]].colorID
      : undefined
  );

  useEffect(() => {
    setListColors({ ...colorsList });

    if (Object.keys(colorsList)[0]) {
      setCurrentColor(colorsList[Object.keys(colorsList)[0]].colorID);
    }
  }, [colorsList]);

  function onChangeColor(event: React.ChangeEvent<HTMLSelectElement>) {
    setCurrentColor(event.target.value);
  }

  function onInputColor(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();

    const newColorsList = { ...listColors };

    newColorsList[event.currentTarget.name] = {
      ...newColorsList[event.currentTarget.name],
      colorCode: event.currentTarget.value,
    };

    setListColors(newColorsList);
  }

  function onClickSave() {
    dispatch(coloringPageActions.setColorsList(listColors));

    Object.keys(listColors).forEach((colorID) => {
      dbFuncs.saveColor({
        id: listColors[colorID].colorID,
        name: listColors[colorID].colorDisplay,
        code: listColors[colorID].colorCode,
      });
    });

    const newColoredVerses: coloredProps = {};
    Object.keys(coloredVerses).forEach((verseKey) => {
      newColoredVerses[verseKey] = listColors[coloredVerses[verseKey].colorID];
    });

    dispatch(coloringPageActions.setColoredVerses(newColoredVerses));
    onClose();
  }

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent dir="ltr">
        <ModalHeader borderBottom="1px solid #dee2e6">Edit colors</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {currentColor && listColors[currentColor] ? (
            <>
              <Flex gap={3} alignItems={"center"} pb={2}>
                <div>Name:</div>
                <Select
                  onChange={onChangeColor}
                  value={currentColor}
                  size={"1"}
                  borderRadius={"0.375rem"}
                  backgroundColor={listColors[currentColor].colorCode}
                  color={getTextColor(listColors[currentColor].colorCode)}
                >
                  {Object.keys(listColors).map((colorID) => (
                    <option
                      key={listColors[colorID].colorID}
                      value={listColors[colorID].colorID}
                      style={{
                        backgroundColor: listColors[colorID].colorCode,
                        color: getTextColor(listColors[colorID].colorCode),
                      }}
                    >
                      {listColors[colorID].colorDisplay}
                    </option>
                  ))}
                </Select>
              </Flex>
              <Flex gap={3}>
                <label>Color: </label>
                <Input
                  onInput={onInputColor}
                  name={currentColor}
                  type="color"
                  value={listColors[currentColor].colorCode}
                />
              </Flex>
            </>
          ) : (
            <>No colors to edit.</>
          )}
        </ModalBody>
        <ModalFooter
          mt={5}
          justifyContent="center"
          borderTop="1px solid #dee2e6"
        >
          <ButtonGroup>
            <Button onClick={onClose}>No, Cancel</Button>
            <Button colorScheme="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditColorsModal;
