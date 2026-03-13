import { useTranslation } from "react-i18next";
import { Box, NativeSelect } from "@chakra-ui/react";
import type { NoteSortOption } from "@/store/pages/yourNotesPage";

interface NoteSortSelectProps {
  sortBy: NoteSortOption;
  onSortChange: (value: NoteSortOption) => void;
}

const NoteSortSelect = ({ sortBy, onSortChange }: NoteSortSelectProps) => {
  const { t } = useTranslation();

  const onChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as NoteSortOption);
  };

  return (
    <Box px={"1rem"} mdDown={{ px: "0.2rem" }} mb={4}>
      <NativeSelect.Root size="sm" width="fit-content">
        <NativeSelect.Field
          value={sortBy}
          onChange={onChangeSelect}
          bg="bg.panel"
          borderColor="border"
        >
          <option value="date">{t("notes.sort_by_date")}</option>
          <option value="rank">{t("notes.sort_by_rank")}</option>
          <option value="status">{t("notes.sort_by_status")}</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  );
};

export { NoteSortSelect };
