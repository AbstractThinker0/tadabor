import { useAppSelector } from "@/store";

const useScreenSize = () => {
  // Get the screen size state from Redux
  const isSmallScreen = useAppSelector(
    (state) => state.navigation.isSmallScreen
  );

  return isSmallScreen;
};

export default useScreenSize;
