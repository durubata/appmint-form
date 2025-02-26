import { classNames } from '../utils';
import { getElementTheme } from '../context/store';
import { twMerge } from 'tailwind-merge';
import React, { useState } from 'react';
import { SliderElement } from './slider';

export const NumberElement = (props: { change; blur; focus; mode; storeId; schema; path; name; value, className, ui?, theme }) => {
  const handleBlur = e => {
    e.preventDefault();
    props.blur(e.target.value * 1);
  };

  const handleChange = e => {
    e.preventDefault();
    props.change(e.target.value * 1);
  };

  const handleFocus = e => {
    e.preventDefault();
    props.focus(e.target.value * 1);
  };

  const variant = props.schema['x-control-variant'] || 'number';
  const showInput = props.schema['x-show-input'];
  const showValue = props.schema['x-show-value'];

  const { classes, style } = (props.ui || {})['number'] || {};
  const controlTheme = getElementTheme('number', props.theme);

  if (variant === 'vertical' || variant === 'horizontal' || variant === 'slider') {
    return <SliderElement name={props.name} storeId={props.storeId} showInput={showInput} showValue={showValue} change={props.change} blur={props.blur} focus={props.focus} value={props.value} schema={props.schema} className={props.className} ui={props.ui} theme={props.theme} />;
  }

  const { schema } = props;
  let max = (schema?.max && typeof schema?.max === 'string' ? parseFloat(schema?.max) : schema?.max) || 100;
  let min = (schema?.min && typeof schema?.min === 'string' ? parseFloat(schema?.min) : schema?.min) || 0;
  let step = (schema?.step && typeof schema?.step === 'string' ? parseFloat(schema?.step) : schema?.step) || 1;

  return (
    <div
      className={classNames(
        'flex items-center w-full rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5',
      )}
    >
      <input
        key={`${props.storeId}-${props.path}-${props.name}`}
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
        className={twMerge('w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5', props.className, controlTheme.className, classes?.join(' '))}
        placeholder={props.schema.placeholder}
      />
    </div>
  );
};
