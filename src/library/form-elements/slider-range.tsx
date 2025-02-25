import React, { useState } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  data: [number, number];
  blur: (minValue: number, maxValue: number) => void;
}

export const SliderRangeElement: React.FC<SliderProps> = ({ min = 0, max = 100, step = 1, data = [0, 0], blur }) => {
  const [minValue, setMinValue] = useState(data[0]);
  const [maxValue, setMaxValue] = useState(data[1]);

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue <= maxValue) {
      setMinValue(newValue);
      blur(newValue, maxValue);
    }
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (newValue >= minValue) {
      setMaxValue(newValue);
      blur(minValue, newValue);
    }
  };

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="w-full h-2 bg-gray-300 rounded-full outline-none appearance-none cursor-pointer transition duration-200 ease-in hover:bg-blue-400 focus:bg-blue-500"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((minValue - min) / (max - min)) * 100}%, #e5e7eb ${((minValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="w-full h-2 bg-gray-300 rounded-full outline-none appearance-none cursor-pointer transition duration-200 ease-in hover:bg-blue-400 focus:bg-blue-500"
        style={{
          background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${((maxValue - min) / (max - min)) * 100}%, #3b82f6 ${((maxValue - min) / (max - min)) * 100}%, #3b82f6 100%)`,
        }}
      />
      <div className="text-xs font-semibold text-gray-600 mt-1">
        {minValue} - {maxValue}
      </div>
    </>
  );
};
