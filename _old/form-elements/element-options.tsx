import { isEmpty } from '../utils';
import { Icon } from '../common/icons/list';
import React from 'react';

export const ElementOptions = (props: { schema }) => {
  return (
    props.schema.options.map((option, index) => {
      return (<ElementOption key={index} option={option} />);
    })
  );
}

const ElementOption = (props: { option }) => {
  if (isEmpty(props?.option)) return null;

  const { image, icon, label, value } = props?.option || {};

  const imageElem = image ? <img src={image} alt='' className='w-10 h-10' /> : null;
  const iconElem = icon?.length === 2 ? icon : icon ? <Icon name={icon} /> : null;

  return (
    <div className='flex items-center gap-2'>
      {imageElem}
      {iconElem}
      <div data-value={value}>{label}</div>
    </div>
  );
};
