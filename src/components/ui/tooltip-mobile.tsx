import { useNavigationStore } from "@/store/global/navigationStore";

import { Tooltip as DefaultTooltip } from "@/components/ui/tooltip";
import { ToggleTip } from "@/components/ui/toggle-tip";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const isMobile = useNavigationStore((state) => state.isSmallScreen);

  if (isMobile) {
    return <ToggleTip content={content}>{children}</ToggleTip>;
  }

  return <DefaultTooltip content={content}>{children}</DefaultTooltip>;
};

export { Tooltip };
