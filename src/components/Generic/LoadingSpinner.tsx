import { Flex, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Flex flexDir="column" h="100%" alignItems="center" justifyContent="center">
      <Spinner
        borderWidth="4px"
        animationDuration="0.65s"
        color="blue.fg"
        size="xl"
      />
    </Flex>
  );
};

export default LoadingSpinner;
