import React, { useState } from 'react';
import data_icon from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Icon } from '../common/icons/list';
import { emojiMartCustom } from 'components/common/icons/emoji-mart-custom';
import { Popover } from 'components/common/popover';
import { classNames } from '../utils';

export const IconPickerElement = (props: { blur, focus, change, path, label, name, data, schema }) => {
  const { path, name, schema, label } = props;
  const [value, setValue] = useState<any>(props.data);


  const handleEmojiSelect = (emoji: any) => {
    if (emoji?.native) {
      setValue(emoji.native);
      props.blur(path, emoji.native, emoji);
    } else {
      setValue(emoji.id);
      props.blur(path, emoji.id, emoji);
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
    props.blur(path, null);
  }

  if (schema['x-control-variant'] === 'inline') {
    return (<div>
      {value && <div className='flex gap-2 items-center mb-2'>
        <div className={classNames('text-sm pl-2 group pr-3 py-1 rounded-full flex items-center gap-2 shadow bg-white border border-gray-100 hover:bg-cyan-100')}>
          {getIcon()}
        </div>
        <button onClick={unselect} ><Icon name='FaXmark' color='red' /></button>
      </div>}
      <Picker
        data={data_icon}
        onEmojiSelect={handleEmojiSelect}
        custom={emojiMartCustom}
      />

    </div>)
  }

  return (
    <div className='flex gap-2 items-center'>
      <Popover position='context' content={<Picker
        data={data_icon}
        onEmojiSelect={handleEmojiSelect}
        custom={emojiMartCustom}
      />}>
        <button onClick={unselect} className={classNames('text-sm pl-2 group pr-3 py-1 rounded-full flex items-center gap-2 shadow bg-white border border-gray-100 hover:bg-cyan-100')}>
          {getIcon() || 'Select Icon'}
        </button>
      </Popover>
      {value && <button onClick={unselect} ><Icon name='FaXmark' color='red' /></button>}
    </div>
  );
};

