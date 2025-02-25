import React, { useState, useEffect } from 'react';
import { SelectManyList } from './select-many-list';
import { toTitleCase } from '../utils';

export const DateTimePicker = (props: { onChange; placeholder?; isRange?; showPreset?; className?; mode; min?; max?; startDate; endDate; readOnly?; disabled?}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isRange, setIsRange] = useState(props.isRange || false);
  const [isInline, setIsInline] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mode, setMode] = useState(props.mode || 'date-time');
  const [error, setError] = useState('');
  const [preset, setPreset] = useState('today');

  useEffect(() => {
    let { startDate, endDate } = props;
    if (props.mode === 'time') {
      setStartDate(startDate);
      setEndDate(endDate);
    } else {
      const dateLength = props.mode === 'date' ? 10 : 16;
      try {
        startDate = new Date(startDate);
      } catch (e) {
        startDate = null;
      }
      if (startDate && startDate.toString() !== 'Invalid Date') {
        setStartDate(startDate.toISOString().slice(0, dateLength));
      }
      try {
        endDate = new Date(endDate);
      } catch (e) {
        endDate = null;
      }
      if (endDate && endDate.toString() !== 'Invalid Date') {
        setEndDate(endDate.toISOString().slice(0, dateLength));
      }
    }
    setMode(props.mode || 'date-time');
  }, [props.startDate, props.endDate]);

  useEffect(() => {
    if (isRange && startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        setEndDate('');
        setError('End date cannot be earlier than start date.');
      } else {
        setError('');
      }
    }

    let output: any = {};
    if (mode === 'time') {
      output = isRange ? { startDate, endDate } : { startDate };
    } else if (mode === 'date') {
      output = isRange ? { startDate, endDate } : { startDate };
    } else {
      output = isRange ? { startDate, endDate } : { startDate };
    }
    props.onChange(output);
  }, [isRange, startDate, endDate]);

  const handleDateChange = (e, isStart) => {
    const newDate = e.target.value;
    console.log('newDate', newDate);
    console.log('newDate', newDate);
    if (mode === 'time') {
      if (isStart) {
        setStartDate(e.target.value);
      } else {
        if (newDate >= startDate) {
          setEndDate(e.target.value);
          setError('');
        } else {
          setError('End date cannot be earlier than start date.');
        }
      }
    } else {
      if (isStart) {
        setStartDate(newDate);
      } else {
        if (new Date(newDate) >= new Date(startDate)) {
          setEndDate(newDate);
          setError('');
        } else {
          setError('End date cannot be earlier than start date.');
        }
      }
    }
  };

  const handlePresetChange = newPreset => {
    setPreset(newPreset);
    const { startDate, endDate } = getDateRange(newPreset);
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
  };

  const renderInputs = isStart => {
    let value;
    let min;
    if (mode === 'time') {
      value = isStart ? startDate : endDate;
      min = isStart ? undefined : startDate;
    } else if (mode === 'date') {
      value = isStart ? startDate : endDate;
      min = isStart ? undefined : startDate;
    } else {
      value = isStart ? `${startDate}` : `${endDate}`;
      min = isStart ? startDate : undefined;
    }
    const inputType = mode === 'date-time' ? 'datetime-local' : mode;
    return (
      <div className={`${isInline ? 'flex space-x-2' : 'space-y-2'}`}>
        <input
          type={inputType}
          readOnly={props.readOnly}
          disabled={props.disabled}
          value={value}
          onChange={e => handleDateChange(e, isStart)}
          min={min}
          className="w-full p-2 border text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  };

  const className = props.className || 'p-4 bg-white rounded-lg shadow-lg';
  return (
    <div className={className}>
      {showControls && (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="date-time">Date and Time</option>
              <option value="date">Date only</option>
              <option value="time">Time only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-700">Range Mode</span>
              <input type="checkbox" checked={isRange} onChange={e => setIsRange(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <span className="mr-2 text-sm font-medium text-gray-700">Inline Mode</span>
              <input type="checkbox" checked={isInline} onChange={e => setIsInline(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600" />
            </label>
          </div>
        </div>
      )}

      {isRange ? (
        <div className="flex gap-2 items-center">
          {props.showPreset && <SelectManyList change={handlePresetChange} options={rangePresets.map(p => ({ label: toTitleCase(p), value: p }))} value={preset} />}
          {renderInputs(true)}
          {renderInputs(false)}
        </div>
      ) : (
        renderInputs(true)
      )}

      {error && <p className="mt-2 text-red-500 text-xs text-center">{error}</p>}
      {showPreview && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Selected:</h3>
          <p className="text-sm text-gray-600">
            {isRange ? (
              <>
                From: {startDate}
                <br />
                To: {endDate}
              </>
            ) : (
              <>
                {mode === 'date' && `Date: ${startDate}`}
                {mode === 'time' && `Time: ${startDate}`}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

const rangePresets = ['today', 'yesterday', 'this week', 'last week', 'this month', 'last month', 'this quarter', 'this year', 'last year'];
const getDateRange = preset => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const thisWeek = new Date();
  thisWeek.setDate(today.getDate() - today.getDay());
  const lastWeek = new Date(thisWeek);
  lastWeek.setDate(thisWeek.getDate() - 7);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const thisQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
  const lastQuarter = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 - 3, 1);
  const thisYear = new Date(today.getFullYear(), 0, 1);
  const lastYear = new Date(today.getFullYear() - 1, 0, 1);

  switch (preset) {
    case 'today':
      return { startDate: today, endDate: today };
    case 'yesterday':
      return { startDate: yesterday, endDate: yesterday };
    case 'this week':
      return { startDate: thisWeek, endDate: today };
    case 'last week':
      return { startDate: lastWeek, endDate: thisWeek };
    case 'this month':
      return { startDate: thisMonth, endDate: today };
    case 'last month':
      return { startDate: lastMonth, endDate: thisMonth };
    case 'this quarter':
      return { startDate: thisQuarter, endDate: today };
    case 'last quarter':
      return { startDate: lastQuarter, endDate: thisQuarter };
    case 'this year':
      return { startDate: thisYear, endDate: today };
    case 'last year':
      return { startDate: lastYear, endDate: thisYear };
    default:
      return { startDate: today, endDate: today };
  }
};
