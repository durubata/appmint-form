import { Transition } from '@headlessui/react';
import { iconType, Icon } from '../common/icons/list';
import React, { useState } from 'react';

export const FormCollapsible = (props: { icon, title, children }) => {
  const [isOpen, setOpen] = useState(false);

  let classes = isOpen
    ? ' w-full  '
    : ' w-full shadow pt-1 p-2 lg:p-4 ';

  const toggle = () => {
    setOpen(!isOpen);
  }

  return (
    <div className={`text-sm mb-4 mt-2 shadow w-full rounded`}>
      <div onClick={toggle} className="p-3 flex justify-between items-center cursor-pointer  border-b-1 border-gray-300 gap-2 bg-gray-50 ">
        {typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon}
        {props.title && <span>{props.title}</span>}
        <div className='flex items-center gap-2 '>
          {isOpen ?
            <Icon
              name={iconType.FaChevronDown}
              aria-hidden="true"
              className=""
            />
            :
            <Icon
              name={iconType.FaChevronRight}
              aria-hidden="true"
              className=""
            />
          }
        </div>
      </div>
      {isOpen && <div className=' p-4 '>
        <Transition
          show={isOpen}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className={`${classes} `}
        >
          <div className="mt-4">{props.children}</div>
        </Transition>
      </div>
      }
    </div>
  );
};
