import { classNames } from '../utils';
import React, { useEffect, useState } from 'react';
import { SocialTextArea } from './social-textarea';
import { twMerge } from 'tailwind-merge';
import { getElementTheme } from './common-imports';

export const TextElement = (props: { readOnly?; change; dataPath, focus; blur; mode; value; schema; path; name; data, className, theme?, ui?}) => {
  const [_value, setValue] = useState(props.value);

  useEffect(() => {
    if (props.schema?.dataBind) {

    }
  }, [props.value, props.schema]);


  const handleBlur = e => {
    e.preventDefault();
    props.blur(e.target.value);
  };

  const handleChange = e => {
    e.preventDefault();
    props.change(e.target.value);
  };

  const handleFocus = e => {
    e.preventDefault();
    props.focus(e.target.value);
  };

  const variant = props.schema['x-control-variant'] || 'text';

  const { classes, style } = (props.ui || {})['number'] || {};
  const controlTheme = getElementTheme('number', props.theme);

  if (variant === 'textarea') {
    return <SocialTextArea change={props.change} blur={props.blur} focus={props.focus} value={props.value} name={props.name} id={props.path} schema={props.schema} />;
  }
  if (variant === 'textarea') {
    return (
      <textarea
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={props.value}
        disabled={props.schema.disabled}
        readOnly={props.readOnly || props.schema.readOnly}
        name={props.name}
        id={props.path}
        rows={4}
        className={twMerge(classNames('block w-full rounded border-0 py-1.5 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5'), props.className)}
        placeholder={props.schema.placeholder}
      />
    );
  }
  return (
    <div
      className={classNames(
        'flex items-center w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5',
      )}
    >
      {props.schema.prefix && <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{props.schema.prefix}</span>}
      <input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={props.value}
        disabled={props.schema.disabled}
        readOnly={props.readOnly || props.schema.readOnly}
        type={variant}
        name={props.name}
        id={props.path}
        className={twMerge('w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5', props.className, controlTheme.className, classes?.join(' '))}
        placeholder={props.schema.placeholder}
      />
      {props.schema.suffix && <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">{props.schema.suffix}</span>}
    </div>
  );
};
