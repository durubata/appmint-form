import React, { useState } from 'react';
import { Icon } from '../icons/list';

export const CodeEditorAppBar = props => {
  const [editName, setEditName] = useState(true);
  const [name, setName] = useState(props.name);

  const onBlur = () => {
    setEditName(true);
    props.setName(name);
  };

  const stopBubble = e => {
    e.stopPropagation();
  };

  return (
    <div className=' flex items-center gap-4 text-sm py-2' onClick={stopBubble}>
      <button title='Menu' className="drag-zone text-white p-2">
        <Icon name='MdMenu' size={12} />
      </button>
      <input type='text' value={name} onChange={e => setName(e.target.value)} onBlur={onBlur} onClick={e => setEditName(false)} disabled={editName} className=' text-sm bg-transparent border-spacing-0 text-white px-3 py-1 rounded w-full' />
      <span>Theme</span>
      <select value={props.theme} onChange={e => props.setTheme(e.target.value)} className='bg-transparent border-spacing-0 text-white px-3 py-1 rounded w-full text-sm' >
        <option value="vs-dark">VS Dark</option>
        <option value="light">Light</option>
      </select>
      <span>Mode</span>
      <select value={props.mode} onChange={e => props.setMode(e.target.value)} className='bg-transparent border-spacing-0 text-white px-3 py-1 rounded w-full text-sm' >
        <option aria-label="None" value="" />
        <option value="typescript">TypeScript</option>
        <option value="javascript">JavaScript</option>
        <option value="html">HTML</option>
        <option value="json">JSON</option>
        <option value="css">CSS</option>
        <option value="less">LESS</option>
        <option value="scss">SCSS</option>
        <option value="xml">XML</option>
      </select>
      <button aria-label="show 4 new mails" color="inherit" onClick={props.onSave} className=' text-white'>
        <Icon name='FaSave' />
      </button>
      <button onClick={props.onClose} aria-label="show 17 new notifications" className=' text-white'>
        <Icon name='FaXmark' />
      </button>
    </div>
  );
};
