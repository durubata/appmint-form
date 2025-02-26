import React from 'react';
import { getRandomString } from '../utils';
import { Icon } from '../form-elements/common-imports';

export const ButtonAdd = (props: { handler; controlRef?; className?}) => {

  const onClick = (event) => {
    props.handler(event, props.controlRef);
  };

  const buttonClass = 'custom-button custom-button-add ' + props.className
  return (
    <button key={getRandomString()} className={buttonClass} onClick={onClick} title="Add item">
      <Icon name='FaPlus' />
    </button>
  );
};
