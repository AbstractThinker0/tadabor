import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Flex, Spacer } from "@chakra-ui/react";

import { RootOccurences } from "@/components/Pages/RootsBrowser/RootOccurences";

import { CollapsibleNote } from "@/components/Note/CollapsibleNote";
import { ButtonExpand } from "@/components/Generic/Buttons";

import { useBoolean } from "usehooks-ts";

interface RootComponentProps {
  root_occurences: string[];
  root_name: string;
  root_id: string;
  root_count: string;
  handleVerseTab: (verseKey: string) => void;
}

const RootComponent = memo(
  ({
    root_occurences,
    root_name,
    root_id,
    root_count,
    handleVerseTab,
  }: RootComponentProps) => {
    const { t } = useTranslation();
    const { value: isOpen, toggle: setOpen } = useBoolean();
    const { value: isOccurencesOpen, toggle: setOccurencesOpen } = useBoolean();

    return (
      <Box px={"5px"} border={"1px solid"} borderColor={"gray.emphasized"}>
        <Flex justify={"center"} fontSize={"larger"} alignItems={"center"}>
          <Spacer />
          <Flex w={"3.5rem"} justify={"center"}>
            {root_name}
          </Flex>
          <Flex flex={1}>
            <ButtonExpand onClick={setOpen} />
            <Button
              w={"7rem"}
              colorPalette="teal"
              variant={"outline"}
              onClick={setOccurencesOpen}
            >
              {t("derivations")} ({root_count})
            </Button>
          </Flex>
        </Flex>
        <CollapsibleNote isOpen={isOpen} noteType="root" noteKey={root_id} />
        <RootOccurences
          isOccurencesOpen={isOccurencesOpen}
          root_occurences={root_occurences}
          handleVerseTab={handleVerseTab}
        />
      </Box>
    );
  }
);

RootComponent.displayName = "RootComponent";

export { RootComponent };
