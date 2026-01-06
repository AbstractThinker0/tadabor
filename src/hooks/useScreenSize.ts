import { useNavigationStore } from "@/store/global/navigationStore";
import { useEffect, useEffectEvent } from "react";

const HookResizeEvent = () => {
  const setSmallScreen = useNavigationStore((state) => state.setSmallScreen);

  const updateScreenSize = useEffectEvent(() => {
    const isSmall = window.innerWidth <= 768 || window.innerHeight <= 480;
    setSmallScreen(isSmall);
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Define the resize handler
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        updateScreenSize();
      }, 150); // Adjust debounce delay as needed
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
};

const useScreenSize = () => {
  // Get the screen size state from Zustand
  const isSmallScreen = useNavigationStore((state) => state.isSmallScreen);

  return isSmallScreen;
};

export { HookResizeEvent };
export default useScreenSize;
