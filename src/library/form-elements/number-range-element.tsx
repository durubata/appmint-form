import { classNames } from '../utils';
import React, { useState } from 'react';
import { SliderRangeElement } from './slider-range';

export const NumberRangeElement = (props: { change; blur; focus; mode; schema; path; name; value }) => {
  const [minMax, setMinMax] = useState(props.value || [0, 0]);

  const handleUpdate = (e, minOrMax) => {
    e.preventDefault();
    const newMinMax = [...minMax];

    const isNumber = !isNaN(e.target.value);
    if (!isNumber) return;
    const value = parseFloat(e.target.value);
    if (minOrMax === 'min' && value > minMax[1]) return;
    if (minOrMax === 'max' && value < minMax[0]) return;
    newMinMax[minOrMax === 'min' ? 0 : 1] = value;
    setMinMax(newMinMax);
    props.blur(newMinMax);
  };

  const variant = props.schema['x-control-variant'] || 'number';

  if (variant === 'vertical' || variant === 'horizontal') {
    return <SliderRangeElement blur={props.blur} data={minMax} max={props.schema.max} min={props.schema.min} step={props.schema.step} />;
  }

  const [min, max] = minMax || [0, 0];
  return (
    <div className="flex gap-2 items-center w-full  ">
      <div className={classNames('w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5')}>
        <input
          onChange={e => handleUpdate(e, 'min')}
          value={min}
          disabled={props.schema.disabled}
          readOnly={props.schema.readOnly}
          type={'number'}
          name={props.name}
          id={props.path + 'min'}
          className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
          placeholder={props.schema.placeholder}
          max={props.schema.max}
          min={props.schema.min}
          step={props.schema.step}
        />
      </div>
      <div className={classNames('w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5')}>
        <input
          onChange={e => handleUpdate(e, 'max')}
          value={max}
          disabled={props.schema.disabled}
          readOnly={props.schema.readOnly}
          type={'number'}
          name={props.name}
          id={props.path + 'max'}
          className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
          placeholder={props.schema.placeholder}
          max={props.schema.max}
          min={props.schema.min}
          step={props.schema.step}
        />
      </div>
    </div>
  );
};
