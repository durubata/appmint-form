import { classNames } from './common-imports';
import React from 'react';
import { SwitchElement } from './switch-element';

export const SelectSingleElement = (props: { change; blur; focus; value; mode; schema; path; name; data, ui?, theme?, className?}) => {
  const handleUpdate = e => {
    e.preventDefault();
    props.change(e.target.value);
  };

  const variant = props.schema['x-control-variant'] || 'text';
  if (variant === 'checkbox' || variant === 'radio') {
    return (
      <input
        name={props.name}
        id={props.path}
        aria-describedby="candidates-description"
        type={variant}
        value={props.value}
        onChange={handleUpdate}
        className={classNames(variant === 'radio' ? 'rounded-full' : 'rounded', 'h-4 w-4  border-gray-300 text-indigo-600 focus:ring-indigo-600')}
      />
    );
  }

  return <SwitchElement {...props} />;
};
