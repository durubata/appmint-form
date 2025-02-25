import React, { useEffect, useState } from 'react';
import { classNames } from '../utils';

export const DateElement = (props: { change, focus, blur, mode, value, schema, path, name, data }) => {
  const [dateTime, setDateTime] = useState<any>();

  useEffect(() => {
    if (props.value) {
      setDateTime(new Date(props.value))
    }
  }, [])

  const getDateFromValue = (e) => {
    const date = new Date(e.target.value)
    if (date.toString() === 'Invalid Date') {
      return ''
    } else {
      return date.toISOString()
    }
  }

  const handleBlur = (e) => {
    e.preventDefault()
    props.blur(getDateFromValue(e))
  };

  const handleChange = (e) => {
    setDateTime(new Date(e.target.value))
  };

  const handleFocus = (e) => {
    e.preventDefault()
    props.focus(e.target.value)
  };

  const variant = props.schema['x-control-variant'] || 'date'
  const type = variant === 'datetime' ? 'datetime-local' : variant === 'time' ? 'time' : 'date'

  const { min, max, disabled, readOnly, prefix, suffix, placeholder } = props.schema

  return (
    <div className={classNames("flex items-center w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
    >
      {prefix && <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{prefix}</span>}
      <input
        onChange={handleChange}
        onBlur={handleBlur}
        value={dateTime}
        disabled={disabled}
        readOnly={readOnly}
        type={type}
        name={props.name}
        min={min}
        max={max}
        id={props.path}
        className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
        placeholder={placeholder}
      />
      {suffix && <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">{suffix}</span>}
    </div>
  );
};
