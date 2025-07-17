import { useState, ComponentProps, ChangeEvent, memo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Input } from './ui/input';

type InputDebounceProps = {
  onChange: (value: string) => void;
  delay?: number;
  defaultValue?: string;
  ref?: React.Ref<HTMLInputElement>;
} & Omit<ComponentProps<'input'>, 'onChange' | 'defaultValue' | 'ref'>;

const InputDebounce = memo(
  ({
    className,
    onChange,
    delay = 500,
    type,
    value,
    defaultValue,
    ref,
    ...props
  }: InputDebounceProps) => {
    const isControlled = value !== undefined;
    const initialValue = isControlled ? value : (defaultValue ?? '');

    const [localValue, setLocalValue] = useState<string>(
      initialValue as string
    );

    useEffect(() => {
      if (isControlled) {
        setLocalValue(value as string);
      }
    }, [value, isControlled]);

    const debouncedOnChange = useDebouncedCallback((value: string) => {
      onChange(value);
    }, delay);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    };

    return (
      <Input
        ref={ref}
        className={cn(className)}
        type={type}
        {...props}
        value={localValue}
        onChange={handleInputChange}
      />
    );
  }
);

InputDebounce.displayName = 'InputDebounce';

export { InputDebounce };
