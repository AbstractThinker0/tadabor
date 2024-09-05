import { useTranslation } from "react-i18next";

import { Button, ButtonProps, IconButton } from "@chakra-ui/react";

import { IconSelect } from "@/components/Generic/Icons";

const ButtonSave = (props: ButtonProps) => {
  const { t } = useTranslation();
  const { children, ...rest } = props;

  return (
    <Button
      type="submit"
      colorScheme="green"
      size="sm"
      fontWeight={"normal"}
      {...rest}
    >
      {t("text_save")}
    </Button>
  );
};

const ButtonEdit = (props: ButtonProps) => {
  const { t } = useTranslation();
  const { children, ...rest } = props;

  return (
    <Button colorScheme="blue" size="sm" fontWeight={"normal"} {...rest}>
      {t("text_edit")}
    </Button>
  );
};

const ButtonExpand = (props: ButtonProps) => {
  return (
    <IconButton
      variant="ghost"
      aria-label="Expand"
      icon={<IconSelect />}
      {...props}
    />
  );
};

const ButtonVerse = (props: ButtonProps) => {
  const { children, ...rest } = props;

  return (
    <Button
      userSelect="text"
      variant="ghost"
      fontSize={"inherit"}
      _hover={{ color: "cornflowerblue" }}
      {...rest}
    >
      {children}
    </Button>
  );
};

export { ButtonSave, ButtonEdit, ButtonExpand, ButtonVerse };
