import { classNames } from '../utils';
import React, { useState } from 'react';
import { SliderElement } from './slider';


export const NumberElement = (props: { change, blur, focus, mode, schema, path, name, value }) => {

  const handleBlur = (e) => {
    e.preventDefault()
    props.blur(e.target.value * 1)
  };

  const handleChange = (e) => {
    e.preventDefault()
    props.change(e.target.value * 1)
  };

  const handleFocus = (e) => {
    e.preventDefault()
    props.focus(e.target.value * 1)
  };


  const variant = props.schema['x-control-variant'] || 'number'
  const { min, max, step } = props.schema

  if (variant === 'vertical' || variant === 'horizontal') {
    return <SliderElement change={props.change} blur={props.blur} focus={props.focus} value={props.value} max={props.schema.max} min={props.schema.min} step={props.schema.step} />
  }

  return (
    <div className={classNames("flex items-center w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
    >
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={props.value}
        disabled={props.schema.disabled}
        readOnly={props.schema.readOnly}
        type={variant}
        min={min}
        max={max}
        step={step}
        name={props.name}
        id={props.path}
        className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
        placeholder={props.schema.placeholder}
      />
    </div>
  );
}