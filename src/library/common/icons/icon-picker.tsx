import { Popover, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import data_icon from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { emojiMartCustom } from './emoji-mart-custom';
import { Icon } from './list';
import { classNames } from '../../utils';


export const IconPicker = (props: { label?, onSelect, value?, popupClassName?, className?, error?, required?, showInlineError?, errorMessage?, helperText?, buttonClass?, }) => {

  const [value, setValue] = useState<any>(props.value);

  const handleEmojiSelect = (emoji: any) => {
    if (emoji?.native) {
      setValue(emoji.native);
      props.onSelect(emoji.native, emoji);
    } else {
      setValue(emoji.id);
      props.onSelect(emoji.id, emoji);
    }
  };

  const getIcon = () => {
    if (value?.length > 2) {
      return <Icon name={value} />;
    } else if (value?.length === 2) {
      return value;
    }
    return null
  }

  const unselect = () => {
    setValue(null);
    props.onSelect(null);
  }


  const iconComponent = (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className={classNames(open ? '' : 'text-opacity-90', props.buttonClass, `group justify-between inline-flex items-center rounded-md p-0 !m-0 text-base font-medium  hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`)}>
            <span className="p-0 text-sm block">{getIcon()}</span>
            {props.label && <Icon name='FaChevronDown' className={`${open ? '' : 'text-opacity-70'}   ml-2 h-5 w-5 text-orange-600 transition duration-150 ease-in-out group-hover:text-opacity-80`} aria-hidden="true" />}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className={classNames(props.popupClassName, "absolute z-10")}>
              <Picker
                data={data_icon}
                onEmojiSelect={handleEmojiSelect}
                custom={emojiMartCustom}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )

  return (
    <div className={props.className}>
      {props.label && <div className='flex justify-end items-center '>
        <p id="continuous-slider">
          {props.label}
        </p>
      </div>
      }
      <div className='flex gap-1'>
        {iconComponent}
        {value && <button onClick={unselect} ><Icon name='FaXmark' color='red' /></button>}
      </div>
      <span>{(props.error && props.showInlineError && props.errorMessage) || props.helperText}</span>
    </div>

  );
};

