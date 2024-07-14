import React from 'react';
import { Icon } from './icons/list';
import { getRandomString } from '../utils';

export const ButtonAdd = (props: { handler; controlRef?, className?}) => {

  const onClick = (event) => {
    props.handler(event, props.controlRef);
  };

  const buttonClass = 'custom-button custom-button-add ' + props.className
  return (
    <button key={getRandomString()} className={buttonClass} onClick={onClick}>
      <Icon name='FaPLus' />
    </button>
  );
};
