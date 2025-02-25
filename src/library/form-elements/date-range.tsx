import { classNames } from '../utils';
import React, { useEffect, useState } from 'react';
import { DateTimePicker } from './date-time-picker';

export const DateRangeElement = (props: { change; focus; blur; mode; value; schema; path; name; data }) => {
  const [dateTime, setDateTime] = useState<any>();
  let variant = props.schema['x-control-variant'] || 'date';
  variant = variant === ('datetime' || 'date-time') ? 'date-time' : variant;

  useEffect(() => {
    if (Array.isArray(props.value)) {
      setDateTime(props.value);
    }
  }, []);

  const handleChange = ({ startDate, endDate }) => {
    let newDate;
    if (variant === 'time') {
      newDate = [startDate, endDate];
      props.blur([startDate, endDate]);
      return;
    } else {
      newDate = [new Date(startDate), new Date(endDate)];
    }
    if (newDate[0].toString() === 'Invalid Date') return;
    props.blur(newDate);
  };

  const handleFocus = e => {
    e.preventDefault();
    props.focus();
  };

  const { min, max, disabled, readOnly, prefix, suffix, placeholder } = props.schema;
  const [startDate, endDate] = dateTime || [null, null];
  return (
    <div
      className={classNames(
        'flex items-center w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5',
      )}
    >
      {prefix && <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{prefix}</span>}
      <DateTimePicker
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        disabled={disabled}
        readOnly={readOnly}
        min={min}
        max={max}
        mode={variant}
        isRange={true}
        className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
        placeholder={placeholder}
      />
      {suffix && <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">{suffix}</span>}
    </div>
  );
};
