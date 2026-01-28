import { useContext } from "react";

import { AudioPlayerContext } from "@/context/AudioPlayerContext";

const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);

  if (!context) {
    throw new Error(
      "useAudioPlayerContext must be used within an AudioPlayerProvider"
    );
  }

  return context;
};

export default useAudioPlayerContext;
