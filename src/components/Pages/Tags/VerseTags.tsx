import { Flex, Span } from "@chakra-ui/react";
import { tagsProps } from "@/components/Pages/Tags/consts";

interface VerseTagsProps {
  versesTags: string[];
  tags: tagsProps;
}

const VerseTags = ({ versesTags, tags }: VerseTagsProps) => {
  return (
    <Flex flexWrap={"wrap"} gap={"5px"} pb={"5px"} fontSize={"medium"}>
      {versesTags.map((tagID) => (
        <Span
          padding={"3px"}
          bgColor={"yellow.emphasized"}
          borderRadius={"0.3rem"}
          overflowWrap={"break-word"}
          overflowX={"hidden"}
          fontFamily={"initial"}
          key={tagID}
        >
          {tags[tagID].tagDisplay}
        </Span>
      ))}
    </Flex>
  );
};

export { VerseTags };
