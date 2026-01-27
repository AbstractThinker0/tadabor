import { Span } from "@chakra-ui/react";

interface VerseIndexProps {
  index: number;
}

const VerseIndex = ({ index }: VerseIndexProps) => {
  return (
    <Span color={"gray.400"} fontSize={"md"} paddingInlineEnd={"5px"}>
      {index + 1}.
    </Span>
  );
};

export { VerseIndex };
