import { useNavigationStore } from "@/store/zustand/navigationStore";

const useBackend = () => {
  const isBetaVersion = useNavigationStore((state) => state.isBetaVersion);

  const isBackendEnabled = import.meta.env.VITE_API && isBetaVersion;

  return isBackendEnabled;
};

export { useBackend };
