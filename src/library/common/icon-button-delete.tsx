import React, { useState } from 'react';
import { getRandomString } from '../utils';
import { IconRenderer } from './icons/icon-renderer';

export const IconButtonDelete = (props: { deleteHandler; variant?; controlRef?; className?; style?, color?; size?}) => {
  const [isActive, setActive] = useState(false);
  const { deleteHandler, controlRef, className, style } = props;

  const confirmClick = () => {
    if (!isActive) {
      setActive(true);
    } else {
      setActive(false);
      deleteHandler(controlRef);
    }
  };

  const iconName = props.variant === 'outline' ? 'MdDeleteOutline' : 'MdDelete';
  return (
    <button key={getRandomString()} className={className} onClick={confirmClick} style={style}>
      {isActive ? <IconRenderer icon='FaCheck' size={props.size || 14} color={'red'} /> : <IconRenderer icon={iconName} size={props.size || 14} color={props.color || 'red'} />}
    </button>
  );
};