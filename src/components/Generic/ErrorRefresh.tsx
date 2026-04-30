import { Button, Flex, VStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { TbReload } from "react-icons/tb";

interface ErrorRefreshProps {
  message?: string;
  handleRefresh?: () => void;
}

const ErrorRefresh = ({ message, handleRefresh }: ErrorRefreshProps) => {
  const { t, i18n } = useTranslation();

  const onClickRefresh = () => {
    handleRefresh?.();
    window.location.reload();
  };

  return (
    <Flex justify="center" align="center" height="100%" dir={i18n.dir()}>
      <VStack gap={4}>
        <Text fontSize="lg">{message ?? t("ui.state.error_unexpected")}</Text>
        <Button colorScheme="blue" onClick={onClickRefresh}>
          <TbReload /> {t("ui.actions.refresh")}
        </Button>
      </VStack>
    </Flex>
  );
};

export { ErrorRefresh };
