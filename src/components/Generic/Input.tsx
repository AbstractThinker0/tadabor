import type { BoxProps, InputProps } from "@chakra-ui/react";
import { CloseButton, Input, InputGroup } from "@chakra-ui/react";
import * as React from "react";

export interface InputGroupProps extends BoxProps {
  inputElementProps?: InputProps;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onClear?: () => void;
}

export const InputString = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputString(props, ref) {
    const { value, onChange, onClear, inputElementProps, ...rest } = props;

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const onClearDefault = () => {
      onClear && onClear();
      inputRef.current?.focus();
    };

    return (
      <InputGroup
        ref={ref}
        endElement={<CloseButton size="xs" onClick={onClearDefault} me="-2" />}
        {...rest}
      >
        <Input
          ref={inputRef}
          value={value}
          size="lg"
          bgColor="bg"
          onChange={onChange}
          {...inputElementProps}
          style={{ paddingInlineEnd: 0 }}
        />
      </InputGroup>
    );
  }
);
