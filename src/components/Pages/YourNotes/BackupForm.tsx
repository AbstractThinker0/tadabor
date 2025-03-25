import { Button, HStack, NativeSelect } from "@chakra-ui/react";

interface BackupFormProps {
  currentFormat: string;
  handleFormat: (format: string) => void;
  notesBackup: () => void;
}

const BackupForm = ({
  currentFormat,
  handleFormat,
  notesBackup,
}: BackupFormProps) => {
  const onChangeFormat = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleFormat(event.target.value);
  };

  return (
    <HStack
      textAlign={"center"}
      padding={2}
      dir="ltr"
      justifyContent={"center"}
    >
      <div>Output format:</div>
      <div>
        <NativeSelect.Root backgroundColor={"bg"}>
          <NativeSelect.Field value={currentFormat} onChange={onChangeFormat}>
            <option value="1">HTML</option>
            <option value="2">JSON</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </div>
      <Button
        colorPalette="green"
        size="sm"
        fontWeight={"normal"}
        onClick={notesBackup}
      >
        Download notes
      </Button>
    </HStack>
  );
};

export default BackupForm;
