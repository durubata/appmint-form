import { getRandomString } from '../utils';
import React, { useEffect } from 'react';
import { Icon } from './icons/list';

export const ButtonCancel = (props: { handler; controlRef?, className?}) => {
  useEffect(() => { });

  const confirmClick = () => {
    props.handler(props.controlRef);
  };

  return (
    <button key={getRandomString()} className={"custom-button custom-button-add " + (props.className || "")} onClick={confirmClick}>
      <Icon name='FaXmark' />
    </button>
  );
};
