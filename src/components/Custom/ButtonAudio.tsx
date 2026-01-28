import { useAudioPlayerStore } from "@/store/global/audioPlayerStore";

import { IconButton } from "@chakra-ui/react";
import { AiOutlineSound } from "react-icons/ai";

interface ButtonAudioProps {
  verseKey?: string;
  onClickAudio: () => void;
}

const ButtonAudio = ({ verseKey, onClickAudio }: ButtonAudioProps) => {
  const currentVerse = useAudioPlayerStore((state) => state.currentVerse);
  const isActive = verseKey && verseKey === currentVerse?.key;

  return (
    <IconButton
      variant={isActive ? "solid" : "ghost"}
      aria-label="Audio"
      colorPalette={isActive ? "teal" : undefined}
      onClick={onClickAudio}
      width={"6px"}
      height={"36px"}
    >
      <AiOutlineSound />
    </IconButton>
  );
};

export { ButtonAudio };
