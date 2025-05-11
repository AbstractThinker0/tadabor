import { useAppSelector } from "@/store";

import { Tooltip as DefaultTooltip } from "@/components/ui/tooltip";
import { ToggleTip } from "@/components/ui/toggle-tip";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const isMobile = useAppSelector((state) => state.navigation.isSmallScreen);

  if (isMobile) {
    return <ToggleTip content={content}>{children}</ToggleTip>;
  }

  return <DefaultTooltip content={content}>{children}</DefaultTooltip>;
};

export { Tooltip };
