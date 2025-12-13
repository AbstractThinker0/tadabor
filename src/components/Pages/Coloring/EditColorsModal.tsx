import { useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { coloringPageActions } from "@/store/slices/pages/coloring";

import { dbFuncs } from "@/util/db";

import type { coloredProps } from "@/components/Pages/Coloring/consts";
import { getTextColor } from "@/components/Pages/Coloring/util";

import {
  Dialog,
  Button,
  ButtonGroup,
  Input,
  Flex,
  NativeSelect,
} from "@chakra-ui/react";

import { DialogCloseTrigger, DialogContent } from "@/components/ui/dialog";

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
      const mapped = listColors[coloredVerses[verseKey]?.colorID];
      if (mapped) {
        newColoredVerses[verseKey] = mapped;
      }
    });

    dispatch(coloringPageActions.setColoredVerses(newColoredVerses));
    onClose();
  }

  return (
    <Dialog.Root
      size="xl"
      open={isOpen}
      onInteractOutside={onClose}
      placement={"center"}
    >
      <DialogContent dir="ltr">
        <Dialog.Header
          borderBottom="1px solid"
          borderColor={"border.emphasized"}
        >
          Edit colors
        </Dialog.Header>

        <Dialog.Body>
          {currentColor && listColors[currentColor] ? (
            <>
              <Flex gap={3} alignItems={"center"} pb={2}>
                <div>Name:</div>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    onChange={onChangeColor}
                    value={currentColor}
                    borderRadius={"0.375rem"}
                    bgColor={listColors[currentColor].colorCode}
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
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
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
        </Dialog.Body>
        <Dialog.Footer
          mt={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor={"border.emphasized"}
        >
          <ButtonGroup>
            <Button onClick={onClose}>No, Cancel</Button>
            <Button colorPalette="blue" onClick={onClickSave}>
              Save changes
            </Button>
          </ButtonGroup>
        </Dialog.Footer>
        <DialogCloseTrigger onClick={onClose} />
      </DialogContent>
    </Dialog.Root>
  );
};

export default EditColorsModal;
