import { useEffect, useRef } from "react";

import useQuran from "@/context/useQuran";

import { useAppSelector, useAppDispatch } from "@/store";
import { audioPageActions } from "@/store/slices/pages/audio";

import { getVerseAudioURL } from "@/util/audioData";
import { verseProps } from "@/types";

import ChaptersList from "@/components/Custom/ChaptersList";
import VerseContainer from "@/components/Custom/VerseContainer";
import NoteText from "@/components/Custom/NoteText";
import { ExpandButton } from "@/components/Generic/Buttons";

import "@/styles/pages/audio.scss";

const Audio = () => {
  const dispatch = useAppDispatch();

  const quranService = useQuran();

  const currentChapter = useAppSelector(
    (state) => state.audioPage.currentChapter
  );

  const currentVerse = useAppSelector((state) => state.audioPage.currentVerse);

  const isPlaying = useAppSelector((state) => state.audioPage.isPlaying);

  const autoPlay = useAppSelector((state) => state.audioPage.autoPlay);

  const duration = useAppSelector((state) => state.audioPage.duration);

  const currentTime = useAppSelector((state) => state.audioPage.currentTime);

  const refAudio = useRef<HTMLAudioElement>(null);
  const refVersesList = useRef<HTMLDivElement>(null);

  const displayVerse = quranService.getVerses(currentChapter);

  const handleChapterChange = (chapter: string) => {
    dispatch(audioPageActions.setCurrentChapter(chapter));
    dispatch(audioPageActions.setCurrentVerse(displayVerse[0]));
  };

  const onClickAudio = (verse: verseProps) => {
    if (!refAudio.current) return;

    const verseRank = quranService.getVerseRank(verse.suraid, verse.verseid);

    refAudio.current.src = getVerseAudioURL(verseRank);
    dispatch(audioPageActions.setCurrentVerse(verse));
    refAudio.current.play();
    dispatch(audioPageActions.setIsPlaying(true));
  };

  const onLoadedMetadata = () => {
    if (!refAudio.current) return;

    dispatch(audioPageActions.setDuration(refAudio.current.duration));
  };

  const onTimeUpdate = () => {
    if (!refAudio.current) return;

    dispatch(audioPageActions.setCurrentTime(refAudio.current.currentTime));
  };

  const togglePlayPause = () => {
    if (!refAudio.current) return;

    if (isPlaying) {
      refAudio.current.pause();
    } else {
      refAudio.current.play();
    }

    dispatch(audioPageActions.setIsPlaying(!isPlaying));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!refAudio.current) return;

    const value = Number(e.target.value);
    refAudio.current.currentTime = value;
    dispatch(audioPageActions.setCurrentTime(value));
  };

  const playNextVerse = (reverse: boolean = false) => {
    // Check if a next verse is available
    const verseRank = currentVerse
      ? quranService.getVerseRank(currentVerse.suraid, currentVerse.verseid)
      : -1;

    if (verseRank !== -1) {
      const nextRank = verseRank + (reverse ? -1 : 1);
      const nextVerse = quranService.absoluteQuran[nextRank];

      if (nextVerse && nextVerse.suraid === currentVerse?.suraid) {
        if (refAudio.current) {
          refAudio.current.src = getVerseAudioURL(nextRank);
          dispatch(audioPageActions.setCurrentVerse(nextVerse));
          refAudio.current.play();
          dispatch(audioPageActions.setIsPlaying(true));
          return true;
        }
      }
    }

    return false;
  };

  const onEnded = () => {
    if (autoPlay) {
      if (playNextVerse()) {
        return;
      }
    }

    dispatch(audioPageActions.setIsPlaying(false));
  };

  useEffect(() => {
    if (!refAudio.current) return;

    const verseRank = quranService.getVerseRank(currentChapter, "1");

    refAudio.current.src = getVerseAudioURL(verseRank);

    dispatch(audioPageActions.setCurrentVerse(displayVerse[0]));
    dispatch(audioPageActions.setIsPlaying(false));
  }, [currentChapter]);

  const onChangeAutoPlay = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(audioPageActions.setAutoPlaying(e.target.checked));
  };

  const onClickPrev = () => {
    playNextVerse(true);
  };

  const onClickNext = () => {
    playNextVerse();
  };

  return (
    <div className="audio">
      <div className="side">
        <ChaptersList
          selectChapter={currentChapter}
          handleChapterChange={handleChapterChange}
          selectClass="side-chapters-list"
        />
      </div>
      <div className="display">
        <div className="display-container" dir="rtl">
          <div className="display-container-title">
            سورة {quranService.getChapterName(currentChapter)}
          </div>
          <div className="display-container-verses" ref={refVersesList}>
            {displayVerse.map((verse) => (
              <div
                className={`display-container-verses-item${
                  verse.key === currentVerse?.key
                    ? " display-container-verses-item-selected"
                    : ""
                }`}
                key={verse.key}
              >
                <VerseContainer>
                  {verse.versetext} ({verse.verseid}){" "}
                  <button
                    className="display-container-verses-item-audio"
                    onClick={() => onClickAudio(verse)}
                  >
                    🔊
                  </button>
                  <ExpandButton identifier={verse.key} />
                </VerseContainer>
                <NoteText verseKey={verse.key} />
              </div>
            ))}
          </div>
        </div>
        <div className="display-audio" dir="ltr">
          <audio
            ref={refAudio}
            src={getVerseAudioURL(0)}
            onLoadedMetadata={onLoadedMetadata}
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            preload="auto"
          />
          <div>
            <input
              type="range"
              min="0"
              step={0.1}
              max={duration}
              value={currentTime}
              onChange={handleSliderChange}
            />

            <label htmlFor="checkboxAutoPlay">🔁</label>
            <input
              id="checkboxAutoPlay"
              type="checkbox"
              checked={autoPlay}
              onChange={onChangeAutoPlay}
            />
          </div>
          <div className="display-audio-buttons">
            <button className="btn btn-dark" onClick={onClickPrev}>
              prev
            </button>
            <button
              onClick={togglePlayPause}
              className="btn btn-dark display-audio-buttons-play"
            >
              {isPlaying ? "Pause" : "Play"} [{currentVerse?.suraid}:
              {currentVerse?.verseid}]
            </button>
            <button className="btn btn-dark" onClick={onClickNext}>
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
