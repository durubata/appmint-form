import React from 'react';
import { SwitchElement } from './switch-element';
import { classNames } from '../utils';

export const SelectSingleElement = (props: { change, blur, focus, mode, schema, path, name, data }) => {

  const handleUpdate = (e) => {
    e.preventDefault()
    props.change(e.target.value)
  };

  const variant = props.schema['x-control-variant'] || 'text'
  const prop: any = {}

  if (variant === 'checkbox' || variant === 'radio') {
    return (
      <input
        title="Input Field"
        name={props.name}
        id={props.path}
        aria-describedby="candidates-description"
        type={variant}
        onChange={handleUpdate}
        className={classNames(variant === 'radio' ? 'rounded-full' : 'rounded', "h-4 w-4  border-gray-300 text-indigo-600 focus:ring-indigo-600")}
      />
    )
  }

  return (
    <SwitchElement change={props.change} />
  );
};
