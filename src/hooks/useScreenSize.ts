import { useAppDispatch, useAppSelector } from "@/store";
import { navigationActions } from "@/store/slices/global/navigation";
import { useEffect } from "react";

const HookResizeEvent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Define the resize handler
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const isSmall = window.innerWidth <= 768 || window.innerHeight <= 480;
        dispatch(navigationActions.setSmallScreen(isSmall));
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
  }, [dispatch]);

  return null;
};

const useScreenSize = () => {
  // Get the screen size state from Redux
  const isSmallScreen = useAppSelector(
    (state) => state.navigation.isSmallScreen
  );

  return isSmallScreen;
};

export { HookResizeEvent };
export default useScreenSize;
