import { Flex, Span, Spinner } from "@chakra-ui/react";

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
  return (
    <Flex
      flexDir="column"
      minH="100%"
      h="100%"
      alignItems="center"
      justifyContent="center"
      flex={1}
    >
      <Span>
        <Spinner
          borderWidth="4px"
          animationDuration="0.65s"
          color="blue.fg"
          size="xl"
        />
      </Span>
      <Span color={"fg.muted"} dir="auto">
        {text}
      </Span>
    </Flex>
  );
};

export default LoadingSpinner;
