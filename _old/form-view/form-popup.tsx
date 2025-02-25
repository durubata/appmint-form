import React from 'react';
import { Popover } from '../common/popover';
import { classNames } from '../utils';
import { Icon } from '../common/icons/list';

export const FormPopup = (props: { icon, title, children }) => {
  return (
    <Popover position='context' className='min-w-[600px] max-h-[800px] overflow-auto' offsetY={-20} content={<div>{props.children}</div>}>
      <button className={classNames('text-sm group  rounded-full flex items-center gap-2 shadow bg-white border border-gray-100 hover:bg-cyan-100 px-4 py-1 min-w-')}>
        {props.icon && <Icon name={props.icon} className={'group-hover:scale-120 duration-300 ease-in-out transition-all'} />}
        <span> {props.title}</span>
      </button>
    </Popover>
  );
};
