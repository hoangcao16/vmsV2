import { Input as MSInput, InputProps } from 'antd';
import React from 'react';

const Input = ({ onChange, ...props }: InputProps) => {
  const onInputChange = (e) => {
    onChange &&
      onChange({
        target: {
          value: e.target.value.trim(),
        },
      } as any);
  };

  return (
    <MSInput
      onChange={onInputChange}
      onBlur={onInputChange}
      onPaste={(e) => {
        e.preventDefault();
        onChange &&
          onChange({
            target: {
              value: e.clipboardData.getData('text').trim(),
            },
          } as any);
      }}
      {...props}
    />
  );
};

export default Input;
