import { Checkbox, CheckboxProps } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const CheckboxDir = (props: CheckboxProps) => {
  const { i18n } = useTranslation();
  const direction = i18n.dir();

  return <Checkbox {...props} dir={direction} />;
};

export default CheckboxDir;
