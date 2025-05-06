import { createContext } from "react";
import { quranClass } from "quran-tools";

export const QuranContext = createContext<quranClass | null>(null);
