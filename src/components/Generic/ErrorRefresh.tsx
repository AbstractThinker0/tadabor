import { Button, Flex, VStack, Text } from "@chakra-ui/react";
import { TbReload } from "react-icons/tb";

interface ErrorRefreshProps {
  message?: string;
  handleRefresh: () => void;
}

const ErrorRefresh = ({
  message = "An unexpected error occurred.",
  handleRefresh,
}: ErrorRefreshProps) => {
  const onClickRefresh = () => {
    handleRefresh();
    window.location.reload();
  };

  return (
    <Flex justify="center" align="center" height="100%">
      <VStack gap={4}>
        <Text fontSize="lg">{message}</Text>
        <Button colorScheme="blue" onClick={onClickRefresh}>
          <TbReload /> Refresh Page
        </Button>
      </VStack>
    </Flex>
  );
};

export { ErrorRefresh };
