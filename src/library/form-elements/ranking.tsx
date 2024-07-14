import React, { useState, useEffect } from 'react';

interface OptionType {
  value: string;
  label: string;
  image?: string;
  icon?: string;
}

interface RankingControlProps {
  options: OptionType[];
  onChange: (rankings: Record<string, number>) => void;
  getOptionIconOrImage: (option: OptionType) => JSX.Element | null;
}

export const RankingInput = (props: { update, mode, schema, path, name, data }) => {
  const [rankings, setRankings] = useState<Record<string, number>>({});

  const options: any = props.schema?.options || []
  const topics: any = props.schema?.topics || []


  // useEffect(() => {
  //   // Initialize rankings
  //   const initialRankings = options?.reduce((acc, option, index) => {
  //     acc[option.name] = index + 1;
  //     return acc;
  //   }, {} as Record<string, number>);
  //   setRankings(initialRankings);
  // }, [options]);

  const handleSelectChange = (optionName: string, rank: number) => {
    setRankings(prev => ({ ...prev, [optionName]: rank }));
    // onChange({ ...rankings, [optionName]: rank });
  };

  const getInput = (option) => {
    switch (props.schema['x-control-variant']) {
      case 'checkbox':
        return (
          <input
            title={option.label}
            type="checkbox"
            value={rankings[option.value]}
            onChange={(e) => handleSelectChange(option.value, parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 h-4 w-4"
          />
        );
      case 'radio':
        return (
          <input
            type="radio"
            title={option.label}
            value={rankings[option.value]}
            onChange={(e) => handleSelectChange(option.value, parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 h-4 w-4"
          />
        );
      case 'slider':
        return (
          <input
            type="range"
            title={option.label}
            value={rankings[option.value]}
            onChange={(e) => handleSelectChange(option.value, parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 w-full"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            title={option.label}
            value={rankings[option.value]}
            onChange={(e) => handleSelectChange(option.value, parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 w-full"
          />
        );
      default:
        return (
          <select
            title={option.label}
            value={rankings[option.value]}
            onChange={(e) => handleSelectChange(option.value, parseInt(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-gray-700 w-full"
          >
            {options.map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        );
    }
  }

  return (
    <div className="w-full">
      <div className={`grid grid-cols-${topics.length + 1}`}>
        {[{}, ...topics]?.map((topic, index) => {
          return (
            <div key={topic.value} className="flex items-center justify-center">
              <span className="mr-2">{topic.label}</span>
            </div>
          )
        })}
        {options?.map((option, index) => {
          return (
            <>
              <div key={option.value} className="flex items-center justify-between">
                <span className="mr-2">{option.label}</span>
              </div>
              {topics?.map((topic, index) => {
                return (
                  <div className=' items-center justify-center p-2 w-full text-center'>
                    {getInput(option)}
                  </div>
                )
              })}
            </>
          )
        })}
      </div>
    </div>
  );
};