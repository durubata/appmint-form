import React, { useState, useEffect } from 'react';

export const CronElement = () => {
  // State for each part of the cron expression
  const [minutes, setMinutes] = useState('*');
  const [hours, setHours] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [activeTab, setActiveTab] = useState('simple');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [scheduleSummary, setScheduleSummary] = useState('Every minute');

  // Multi-select state for days of week
  const [selectedDays, setSelectedDays] = useState({
    0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false
  });

  // Update cron expression when any part changes
  useEffect(() => {
    const newCronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCronExpression(newCronExpression);
    updateScheduleSummary(newCronExpression);
  }, [minutes, hours, dayOfMonth, month, dayOfWeek]);

  // Handle day of week selection
  const handleDaySelect = (day) => {
    const newSelectedDays = { ...selectedDays, [day]: !selectedDays[day] };
    setSelectedDays(newSelectedDays);

    // Convert selected days to cron expression format
    const selectedDaysList = Object.entries(newSelectedDays)
      .filter(([_, isSelected]) => isSelected)
      .map(([day]) => day);

    if (selectedDaysList.length === 0) {
      setDayOfWeek('*');
    } else if (selectedDaysList.length === 7) {
      setDayOfWeek('*');
    } else {
      setDayOfWeek(selectedDaysList.join(','));
    }
  };

  // Handle hour selection (single or range)
  const handleHourSelect = (hour) => {
    setHours(hour);
  };

  // Handle applying a preset
  const applyPreset = (preset) => {
    const parts = preset.expression.split(' ');
    setMinutes(parts[0]);
    setHours(parts[1]);
    setDayOfMonth(parts[2]);
    setMonth(parts[3]);
    setDayOfWeek(parts[4]);

    // Update selected days based on the day of week expression
    if (parts[4] === '*') {
      setSelectedDays({ 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
    } else {
      const newSelectedDays = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false };
      const dayParts = parts[4].split(',');

      dayParts.forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            newSelectedDays[i] = true;
          }
        } else {
          newSelectedDays[parseInt(part)] = true;
        }
      });

      setSelectedDays(newSelectedDays);
    }
  };

  // Generate human-readable summary of the schedule
  const updateScheduleSummary = (cron) => {
    const parts = cron.split(' ');
    let summary = '';

    // This is a simplified summary generator
    if (parts[0] === '*' && parts[1] === '*' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
      summary = 'Every minute';
    } else if (parts[0].startsWith('*/') && parts[1] === '*' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
      summary = `Every ${parts[0].split('/')[1]} minutes`;
    } else if (parts[0] === '0' && parts[1] === '*' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
      summary = 'At the start of every hour';
    } else if (parts[0] === '0' && parts[1] === '0' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
      summary = 'At midnight every day';
    } else if (parts[0] === '0' && parts[1] === '12' && parts[2] === '*' && parts[3] === '*' && parts[4] === '*') {
      summary = 'At noon every day';
    } else if (parts[4] === '1-5') {
      summary = 'On weekdays';
    } else if (parts[4] === '0,6') {
      summary = 'On weekends';
    } else {
      summary = 'Custom schedule';
    }

    setScheduleSummary(summary);
  };

  // Copy cron expression to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const presets = [
    { label: 'Every minute', expression: '* * * * *' },
    { label: 'Every hour', expression: '0 * * * *' },
    { label: 'Every day at midnight', expression: '0 0 * * *' },
    { label: 'Every day at noon', expression: '0 12 * * *' },
    { label: 'Weekdays at 9am', expression: '0 9 * * 1-5' },
    { label: 'Weekends at 10am', expression: '0 10 * * 0,6' }
  ];

  const renderSimpleTab = () => (
    <div className="space-y-4">
      {/* Time selection */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
        <div className="flex space-x-2">
          <select
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="p-1 text-sm border border-gray-300 rounded"
          >
            <option value="*">Every hour</option>
            <option value="0">12am</option>
            <option value="6">6am</option>
            <option value="9">9am</option>
            <option value="12">12pm</option>
            <option value="15">3pm</option>
            <option value="18">6pm</option>
            <option value="21">9pm</option>
          </select>
          <span className="flex items-center">:</span>
          <select
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            className="p-1 text-sm border border-gray-300 rounded"
          >
            <option value="*">Every minute</option>
            <option value="0">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="*/5">Every 5m</option>
            <option value="*/15">Every 15m</option>
            <option value="*/30">Every 30m</option>
          </select>
        </div>
      </div>

      {/* Day selection */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Days</label>
        <div className="flex flex-wrap gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <button
              key={index}
              className={`w-6 h-6 text-xs flex items-center justify-center rounded-full 
                ${selectedDays[index] ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => handleDaySelect(index)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Quick Presets</label>
        <div className="flex flex-wrap gap-1">
          <button
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => applyPreset(presets[0])}
          >
            Every minute
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => applyPreset(presets[1])}
          >
            Hourly
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => applyPreset(presets[2])}
          >
            Daily
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => applyPreset(presets[4])}
          >
            Weekdays
          </button>
          <button
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            onClick={() => applyPreset(presets[5])}
          >
            Weekends
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-4">
      {/* Minutes */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Minutes</label>
        <input
          type="text"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-full p-1 text-sm border border-gray-300 rounded"
          placeholder="* or */15 or 0,30"
        />
        <div className="flex flex-wrap gap-1 mt-1">
          <button onClick={() => setMinutes('*')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*</button>
          <button onClick={() => setMinutes('*/5')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*/5</button>
          <button onClick={() => setMinutes('*/15')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*/15</button>
          <button onClick={() => setMinutes('0')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">0</button>
        </div>
      </div>

      {/* Hours */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Hours</label>
        <input
          type="text"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full p-1 text-sm border border-gray-300 rounded"
          placeholder="* or */2 or 9-17"
        />
        <div className="flex flex-wrap gap-1 mt-1">
          <button onClick={() => handleHourSelect('*')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*</button>
          <button onClick={() => handleHourSelect('9-17')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">9-17</button>
          <button onClick={() => handleHourSelect('0')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">0</button>
          <button onClick={() => handleHourSelect('12')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">12</button>
        </div>
      </div>

      {/* Day of Month */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Day of Month</label>
        <input
          type="text"
          value={dayOfMonth}
          onChange={(e) => setDayOfMonth(e.target.value)}
          className="w-full p-1 text-sm border border-gray-300 rounded"
          placeholder="* or 1,15 or 1-5"
        />
        <div className="flex flex-wrap gap-1 mt-1">
          <button onClick={() => setDayOfMonth('*')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*</button>
          <button onClick={() => setDayOfMonth('1')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">1</button>
          <button onClick={() => setDayOfMonth('L')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">L</button>
        </div>
      </div>

      {/* Month */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
        <input
          type="text"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full p-1 text-sm border border-gray-300 rounded"
          placeholder="* or 1,6,12"
        />
        <div className="flex flex-wrap gap-1 mt-1">
          <button onClick={() => setMonth('*')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*</button>
          <button onClick={() => setMonth('1-3')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">1-3</button>
          <button onClick={() => setMonth('6-8')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">6-8</button>
        </div>
      </div>

      {/* Day of Week */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Day of Week (0=Sun, 1=Mon, ...)</label>
        <input
          type="text"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          className="w-full p-1 text-sm border border-gray-300 rounded"
          placeholder="* or 1-5 or 0,6"
        />
        <div className="flex flex-wrap gap-1 mt-1">
          <button onClick={() => setDayOfWeek('*')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">*</button>
          <button onClick={() => setDayOfWeek('1-5')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">1-5</button>
          <button onClick={() => setDayOfWeek('0,6')} className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded">0,6</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-4">
      {/* Cron Expression Display */}
      <div className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded">
        <div>
          <div className="font-mono text-sm">{cronExpression}</div>
          <div className="text-xs text-gray-500">{scheduleSummary}</div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => {
              setMinutes('*');
              setHours('*');
              setDayOfMonth('*');
              setMonth('*');
              setDayOfWeek('*');
              setSelectedDays({ 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false });
            }}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
          >
            Clear
          </button>
          <button
            onClick={copyToClipboard}
            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-3">
        <button
          className={`px-3 py-1 text-sm font-medium ${activeTab === 'simple' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('simple')}
        >
          Simple
        </button>
        <button
          className={`px-3 py-1 text-sm font-medium ${activeTab === 'advanced' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'simple' ? renderSimpleTab() : renderAdvancedTab()}
    </div>
  );
};
