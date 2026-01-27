import { Span } from "@chakra-ui/react";
import { ButtonVerse } from "@/components/Generic/Buttons";
import useQuran from "@/context/useQuran";

interface VerseRefProps {
  suraid: string;
  verseid: string;
  onClickChapter?: () => void;
  onClickVerse?: () => void;
  color?: string;
}

const VerseRef = ({
  suraid,
  verseid,
  onClickChapter,
  onClickVerse,
  color,
}: VerseRefProps) => {
  const quranService = useQuran();

  if (onClickChapter) {
    return (
      <Span whiteSpace="nowrap">
        (
        <ButtonVerse color={color} onClick={onClickChapter}>
          {quranService.getChapterName(suraid)}
        </ButtonVerse>
        :
        <ButtonVerse color={color} onClick={onClickVerse}>
          {verseid}
        </ButtonVerse>
        )
      </Span>
    );
  }

  return (
    <ButtonVerse color={color} onClick={onClickVerse}>
      ({verseid})
    </ButtonVerse>
  );
};

export { VerseRef };
