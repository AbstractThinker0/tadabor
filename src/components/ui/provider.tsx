import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme/index";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function UIProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
