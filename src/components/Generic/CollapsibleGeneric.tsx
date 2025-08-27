import { Collapsible } from "@chakra-ui/react";

interface CollapsibleGenericProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const CollapsibleGeneric = ({
  isOpen,
  children,
}: CollapsibleGenericProps) => {
  return (
    <Collapsible.Root
      open={isOpen}
      pt={isOpen ? "4px" : undefined}
      lazyMount
      unmountOnExit
    >
      <Collapsible.Content>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
};
