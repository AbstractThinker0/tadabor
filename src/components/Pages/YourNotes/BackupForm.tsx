import { Button, HStack, Select } from "@chakra-ui/react";

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
        <Select
          backgroundColor={"whiteAlpha.900"}
          value={currentFormat}
          onChange={onChangeFormat}
        >
          <option value="1">HTML</option>
          <option value="2">JSON</option>
        </Select>
      </div>
      <Button
        colorScheme="green"
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
