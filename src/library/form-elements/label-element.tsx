import { statusColors } from '../context/store';
import { classNames, twMerge } from './common-imports';
import React from 'react';

export const LabelElement = (props: { path; name; value; className }) => {
  const prop: any = {};

  const handleUpdate = (emoji: any) => { };

  return <div className={twMerge(classNames('px-2 py-1 rounded-lg shadow w-fit', props.className, statusColors[props.value?.toLowerCase()]))}>{props.value}</div>;
};

