import { useAppSelector } from "@/store";

interface VerseContainerProps {
  children?: React.ReactNode | undefined;
  extraClass?: string;
}

const VerseContainer = ({ children, extraClass }: VerseContainerProps) => {
  const quranFS = useAppSelector((state) => state.settings.quranFontSize);

  return (
    <span className={extraClass} style={{ fontSize: `${quranFS}rem` }}>
      {children}
    </span>
  );
};

export default VerseContainer;
