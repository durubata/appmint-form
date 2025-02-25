// GenericCardRenderer.jsx
import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { classNames } from '../utils';
import { FaCheckCircle, FaTimesCircle, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';

export const TableCardRenderer = ({ row, selected, onSelect, slimRow }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      key={row.id}
      id={row.id}
      className={classNames(selected ? 'bg-cyan-100' : '', 'p-6 border rounded-lg shadow-md cursor-pointer hover:bg-cyan-50 transition-colors duration-200')}
      onClick={() => onSelect(row)}
      role="button"
      tabIndex={0}
      onKeyPress={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(row);
        }
      }}
      aria-pressed={selected}
      aria-label={`Card for ${row.original.name || 'N/A'}`}
    >
      <div className="flex justify-between items-center mb-4">{/* Optional: Add RowHandler or other controls here */}</div>
      <div className="space-y-3">
        {row.getVisibleCells().map(cell => {
          const header = flexRender(cell.column.columnDef.header, cell.getContext());
          const value = cell.getValue(); // Get raw data

          // Handle specific cases if needed, e.g., file attachments
          if (header.toLowerCase().includes('file') || header.toLowerCase().includes('attachment')) {
            return (
              <div key={cell.id} className="flex">
                <div className="font-semibold w-1/3">{header}:</div>
                <div className="w-2/3">
                  {/* Assuming files are URLs */}
                  {isValidUrl(value) ? (
                    <div className="flex items-center">
                      <a href={value} download className="text-blue-500 hover:underline flex items-center">
                        Download
                        <FaDownload className="ml-1" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-500">Invalid File</span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={cell.id} className="flex">
              <div className="font-semibold w-1/3">{header}:</div>
              <div className="w-2/3">
                <RecursiveRenderer value={value} />
              </div>
            </div>
          );
        })}
      </div>
      {/* Expandable Section */}
      <button
        className="mt-4 text-blue-500 hover:underline"
        onClick={e => {
          e.stopPropagation(); // Prevent card click
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
      {isExpanded && (
        <div className="mt-2">
          {/* Render additional details here */}
          <pre className="text-sm text-gray-700">{JSON.stringify(row.original, null, 2)}</pre>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="text-green-500 hover:text-green-700"
          onClick={e => {
            e.stopPropagation();
            // Handle Edit action
            console.log(`Edit row ${row.id}`);
          }}
          aria-label={`Edit ${row.original.name || 'N/A'}`}
        >
          <FaEdit />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={e => {
            e.stopPropagation();
            // Handle Delete action
            console.log(`Delete row ${row.id}`);
          }}
          aria-label={`Delete ${row.original.name || 'N/A'}`}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

/**
 * RecursiveRenderer Component
 *
 * Props:
 * - value: The data to render, which can be a primitive, array, or object.
 */
const RecursiveRenderer = ({ value }) => {
  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Utility function to check if a string is a valid URL
  const isValidUrl = string => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Utility function to check if a URL points to an image
  const isImageUrl = url => {
    return /\.(jpeg|jpg|gif|png|svg)$/.test(url);
  };

  // Recursive rendering based on the type of value
  if (React.isValidElement(value)) {
    // If it's a React element, render it directly
    return value;
  }

  if (value === null || value === undefined) {
    return <span className="text-gray-500">N/A</span>;
  }

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc list-inside">
        {value.map((item, index) => (
          <li key={index}>
            <RecursiveRenderer value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object') {
    return (
      <div className="text-sm text-gray-600">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="mb-1">
            <strong>{capitalizeFirstLetter(key)}:</strong> <RecursiveRenderer value={val} />
          </div>
        ))}
      </div>
    );
  }

  // Handle primitive types
  switch (typeof value) {
    case 'boolean':
      return value ? <FaCheckCircle className="text-green-500 inline-block" /> : <FaTimesCircle className="text-red-500 inline-block" />;

    case 'number':
      return <span className="text-right">{value}</span>;

    case 'string':
      if (isValidUrl(value)) {
        if (isImageUrl(value)) {
          return <img src={value} alt="Image" className="w-16 h-16 object-cover rounded" />;
        }
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Link
          </a>
        );
      }
      return <span>{value}</span>;

    default:
      return <span>{String(value)}</span>;
  }
};

// Utility functions
const isValidUrl = string => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isImageUrl = url => {
  return /\.(jpeg|jpg|gif|png|svg)$/.test(url);
};
