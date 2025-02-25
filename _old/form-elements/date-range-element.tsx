import React, { useState } from 'react';
import { classNames } from '../utils';

export const DateRangeElement = (props: { change, focus, blur, mode, value, schema, path, name, data }) => {
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();

  const getDateFromValue = (e) => {
    const date = new Date(e.target.value)
    if (date.toString() === 'Invalid Date') {
      return ''
    } else {
      return date.toISOString()
    }
  }

  const handleUpdate = (e, startOrEnd) => {
    e.preventDefault()
    const isNumber = !isNaN(e.target.value)
    if (!isNumber) return
    const value = getDateFromValue(e)
    if (startOrEnd === 'start' && value > endDate) return
    if (startOrEnd === 'end' && value < startDate) return
    const newDate = [startDate, endDate]
    if (startOrEnd === 'start') {
      setStartDate(value)
      newDate[0] = value
    } else {
      setEndDate(value)
      newDate[1] = value
    }
    props.blur(newDate)
  };


  const variant = props.schema['x-control-variant'] || 'date'
  const type = variant === 'datetime' ? 'datetime-local' : variant === 'time' ? 'time' : 'date'

  const { min, max, disabled, readOnly, prefix, suffix, placeholder } = props.schema

  return (
    <div className='flex gap-2 items-center w-full  '>
      <div className={classNames("w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
      >
        {prefix && <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{prefix}</span>}
        <input
          onChange={e => handleUpdate(e, 'start')}
          value={startDate}
          disabled={disabled}
          readOnly={readOnly}
          type={'date'}
          name={props.name}
          id={props.path + 'start'}
          className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
          placeholder={placeholder}
          max={max}
          min={min}
        />
      </div>
      <div className={classNames("w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
      >
        <input
          onChange={e => handleUpdate(e, 'end')}
          value={endDate}
          disabled={disabled}
          readOnly={readOnly}
          type={'date'}
          name={props.name}
          id={props.path + 'end'}
          className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
          placeholder={placeholder}
          max={max}
          min={min}
        />
      </div>
      {suffix && <span className="flex select-none items-center pr-3 text-gray-500 sm:text-sm">{suffix}</span>}
    </div>
  );
};
