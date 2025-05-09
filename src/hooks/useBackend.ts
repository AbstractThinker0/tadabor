import { useAppSelector } from "@/store";

const useBackend = () => {
  const isBetaVersion = useAppSelector(
    (state) => state.navigation.isBetaVersion
  );

  const isBackendEnabled = import.meta.env.VITE_API && isBetaVersion;

  return isBackendEnabled;
};

export { useBackend };
