import { classNames } from '../utils';
import React, { useState } from 'react';


export const TextElement = (props: { change, focus, blur, mode, value, schema, path, name, data }) => {
  const [_value, setValue] = useState(props.value);

  const handleBlur = (e) => {
    e.preventDefault()
    props.blur(e.target.value)
  };

  const handleChange = (e) => {
    e.preventDefault()
    props.change(e.target.value)
  };

  const handleFocus = (e) => {
    e.preventDefault()
    props.focus(e.target.value)
  };

  const variant = props.schema['x-control-variant'] || 'text'

  if (variant === 'textarea') {
    return <textarea
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      value={props.value}
      disabled={props.schema.disabled}
      readOnly={props.schema.readOnly}
      name={props.name}
      id={props.path}
      rows={4}
      className={classNames("block w-full rounded border-0 py-1.5 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
      placeholder={props.schema.placeholder}
    />
  }
  return (
    <div className={classNames("flex items-center w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
    >
      {props.schema.prefix && <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{props.schema.prefix}</span>}
      <input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={props.value}
        disabled={props.schema.disabled}
        readOnly={props.schema.readOnly}
        type={variant}
        name={props.name}
        id={props.path}
        className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
        placeholder={props.schema.placeholder}
      />
      {props.schema.suffix && <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">{props.schema.suffix}</span>}
    </div>

  );
}