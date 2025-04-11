import { translationsProps } from "@/types";

// fetches data and cache it for long duration
async function fetchJsonPerm(url: string) {
  const response = await fetch(`/res${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "max-age=31536000, immutable",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  return response.json();
}

const fetchChapters = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetchJsonPerm("/chapters.json")
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchQuran = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetchJsonPerm("/quran_v2.json")
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const fetchRoots = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    fetchJsonPerm("/quranRoots-0.0.13.json")
      .then((data) => {
        resolve(data);
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
    const data = await fetchJsonPerm(transList[key].url);

    transData[key] = data;
  }

  return transData;
};

export { fetchChapters, fetchQuran, fetchRoots, fetchTranslations };
