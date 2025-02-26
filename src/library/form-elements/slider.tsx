import React, { useEffect, useState } from 'react';
import { getElementTheme } from '../context/store';
import { twMerge } from 'tailwind-merge';

interface SliderProps {
  storeId?: string;
  name?: string;
  schema?: any;
  value?: number;
  change: (event: any) => void;
  blur: (event: any) => void;
  focus: (event: any) => void;
  showInput?: boolean;
  showValue?: boolean;
  ui?: any;
  theme?: string;
  className?: string;
}

export const SliderElement: React.FC<SliderProps> = ({ schema, name, storeId, value, change, blur, focus, showInput, showValue = true, className, ui, theme }) => {
  const [_value, setValue] = useState<number>(value);

  useEffect(() => {
    setValue(value);
  }, [storeId, name]);

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    if (blur) {
      blur(newValue * 1);
    }
  };

  const handleFocus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    if (focus) {
      focus(newValue * 1);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    if (change) {
      change(newValue * 1);
    }
  };

  let max = (schema?.max && typeof schema?.max === 'string' ? parseFloat(schema?.max) : schema?.max) || 100;
  let min = (schema?.min && typeof schema?.min === 'string' ? parseFloat(schema?.min) : schema?.min) || 0;
  let step = (schema?.step && typeof schema?.step === 'string' ? parseFloat(schema?.step) : schema?.step) || 1;

  const { classes, style } = (ui || {})['slider'] || {};
  const controlTheme = getElementTheme('slider', theme);

  return (
    <div className='relative flex gap-4 items-center justify-between'>
      <input
        key={`${storeId}-${name}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={_value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        title={schema?.title || name || "Slider"}
        aria-label={schema?.title || name || "Slider"}
        className={twMerge("w-full h-2 bg-sky-200 rounded-full outline-none appearance-none cursor-pointer transition duration-200 ease-in hover:bg-blue-400 focus:bg-blue-500", className, controlTheme.className, classes?.join(' '))}
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((_value - min) / (max - min)) * 100}%, #e5e7eb ${((_value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
      {showInput ? (
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={_value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          title={schema?.title || name || "Value input"}
          aria-label={schema?.title || name || "Value input"}
          className={twMerge("w-full max-w-16 bg-sky-50 rounded outline-none text-sm border-sky-500 p-1 transition duration-200 ease-in text-right", className, controlTheme.className, classes?.join(' '))}
        />) : (
        showValue && <div className="text-xs font-semibold text-gray-600">{isNaN(_value) ? 0 : _value?.toFixed(1)}</div>
      )}
    </div>
  );
};
