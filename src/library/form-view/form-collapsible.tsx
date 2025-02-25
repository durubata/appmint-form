import { twMerge } from 'tailwind-merge';
import { Transition, iconType, Icon, getElementTheme, classNames, localStorageUtils } from './common-imports';
import React, { useEffect, useState } from 'react';

export const FormCollapsible = (props: { id?; icon?; title?; children; theme?; defaultState?; className?, ui?, arrayControl?}) => {
  const [isOpen, setOpen] = useState(props.defaultState === 'open' ? true : false);

  useEffect(() => {
    if (props.id) {
      const _isOpen = localStorageUtils.get('collapsible-' + props.id);
      if (typeof _isOpen === 'boolean') {
        setOpen(_isOpen);
      }
    }
  }, []);

  const toggle = () => {
    const newState = !isOpen;
    setOpen(newState);
    if (props.id) {
      localStorageUtils.set('collapsible-' + props.id, JSON.stringify(newState));
    }
  };

  let openClassName = isOpen ? ' w-full  ' : ' w-full shadow pt-1 p-2 lg:p-4 ';
  const { classes, style } = (props.ui || {})['collapsible'] || {};
  const controlTheme = getElementTheme('collapsible', props.theme);
  return (
    <div className={twMerge(classNames('cb-collapsible', props.className, controlTheme.className, classes?.join(' ')))}>
      <div onClick={toggle} className="p-2 flex justify-between items-center cursor-pointer  border-b-1 border-gray-300 gap-2 bg-gray-50 ">
        <div className='flex gap-2 items-center'>
          {typeof props.icon === 'string' ? <Icon name={props.icon} /> : props.icon}
          {typeof props.arrayControl?.index === 'number' && props.arrayControl.index}
          {props.title && <span>{props.title}</span>}
        </div>
        <div className='flex gap-2 items-center'>
          {props.arrayControl?.delete && props.arrayControl.delete}
          <div className="flex items-center gap-2 ">{isOpen ? <Icon name={iconType.FaChevronDown} aria-hidden="true" className="" size={10} /> : <Icon name={iconType.FaChevronRight} aria-hidden="true" className="" size={10} />}</div>
        </div>
      </div>
      {isOpen && (
        <div className=" p-2 ">
          <Transition show={isOpen} enter="transition-opacity duration-75" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0" className={`${openClassName} `}>
            <div className="mt-1">{props.children}</div>
          </Transition>
        </div>
      )}
    </div>
  );
};
