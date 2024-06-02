import axios from "axios";
import { translationsProps } from "@/types";

// An axios instance that fetches data and cache it for long duration
const fetchJsonPerm = axios.create({
  baseURL: "/res",
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": `max-age=31536000, immutable`,
  },
});

const fetchChapters = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetchJsonPerm
      .get("/chapters.json")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchQuran = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetchJsonPerm
      .get("/quran_v2.json")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchRoots = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetchJsonPerm
      .get("/quranRoots-0.0.9.json")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchTranslations = async () => {
  interface transListProps {
    [key: string]: { url: string };
  }

  const transList: transListProps = {
    "Muhammad Asad": { url: "/trans/Muhammad Asad v3.json" },
    "The Monotheist Group": { url: "/trans/The Monotheist Group.json" },
  };

  const transData: translationsProps = {};

  for (const key of Object.keys(transList)) {
    const response = await fetchJsonPerm.get(transList[key].url);

    transData[key] = response.data;
  }

  return transData;
};

export { fetchChapters, fetchQuran, fetchRoots, fetchTranslations };
