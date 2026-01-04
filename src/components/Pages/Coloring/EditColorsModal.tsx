import { useState } from "react";

import { useColoringPageStore } from "@/store/zustand/coloringPage";

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
  const colorsList = useColoringPageStore((state) => state.colorsList);
  const saveColorsList = useColoringPageStore((state) => state.saveColorsList);

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

  async function onClickSave() {
    await saveColorsList(listColors);
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
