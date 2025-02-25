import React, { useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  change: (event: any) => void;
  blur: (event: any) => void;
  focus: (event: any) => void;
}

export const SliderElement: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  change, blur, focus,
}) => {
  const [_value, setValue] = useState(value);

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

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={_value}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className="w-full h-2 bg-gray-300 rounded-full outline-none appearance-none cursor-pointer transition duration-200 ease-in hover:bg-blue-400 focus:bg-blue-500"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((_value - min) / (max - min)) * 100
            }%, #e5e7eb ${((_value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
        title="Slider"
      />
      <div className="text-xs font-semibold text-gray-600 mt-1">{isNaN(_value) ? 0 : _value?.toFixed(1)}</div>
    </>
  );
};
