import React, { useEffect, useState } from 'react';
import { DateTimePicker } from './date-time-picker';

export const DateElement = (props: { change; focus; blur; mode; value; schema; path; name; data; reloadValue }) => {
  const [dateTime, setDateTime] = useState<any>();
  let variant = props.schema['format'] || props.schema['x-control-variant'] || 'date';
  variant = variant === ('datetime' || 'date-time') ? 'date-time' : variant;

  useEffect(() => {
    if (props.value) {
      setDateTime(new Date(props.value));
    }
  }, []);

  const getDateFromValue = e => {
    const date = new Date(e.target.value);
    if (date.toString() === 'Invalid Date') {
      return '';
    } else {
      return date.toISOString();
    }
  };

  const handleBlur = e => {
    e.preventDefault();
    props.blur(getDateFromValue(e));
  };

  const handleChange = ({ startDate, endDate }) => {
    let newDate;
    if (variant === 'date') {
      newDate = new Date(startDate);
    } else if (variant === 'time') {
      newDate = startDate;
      props.blur(startDate);
      return;
    } else {
      newDate = new Date(startDate);
    }
    if (newDate.toString() === 'Invalid Date') return;
    props.blur(newDate.toISOString());
  };

  const handleFocus = e => {
    e.preventDefault();
    props.focus(e.target.value);
  };

  const { min, max, disabled, readOnly, prefix, suffix, placeholder } = props.schema;

  return (
    <>
      {prefix && <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{prefix}</span>}
      <DateTimePicker
        onChange={handleChange}
        startDate={dateTime}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        mode={variant}
        isRange={false}
        className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
        placeholder={placeholder}
      />
      {suffix && <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">{suffix}</span>}
    </>
  );
};
