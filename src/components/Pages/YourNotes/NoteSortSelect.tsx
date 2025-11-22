import { useTranslation } from "react-i18next";
import { Box, NativeSelect } from "@chakra-ui/react";

interface NoteSortSelectProps {
    sortBy: "rank" | "status" | "date";
    onSortChange: (value: "rank" | "status" | "date") => void;
}

const NoteSortSelect = ({ sortBy, onSortChange }: NoteSortSelectProps) => {
    const { t } = useTranslation();

    return (
        <Box px={"1rem"} mdDown={{ px: "0.2rem" }} mb={4}>
            <NativeSelect.Root size="sm" width="fit-content">
                <NativeSelect.Field
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value as any)}
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

export default NoteSortSelect;
