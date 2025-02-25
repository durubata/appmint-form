import React, { useState } from 'react';
import HTMLEditor from 'components/common/ai-editor';

export const HTMLElement = (props: { path, name }) => {
  const fullPath = `${props.path}/${props.name}`;
  const [content, setContent] = useState('');

  const handleUpdate = (value) => {
    console.log('handleUpdate', fullPath, value)
  }
  return (
    <div>
      <HTMLEditor value={content || ''} onChange={(e) => handleUpdate(e.target.value)} />
    </div>
  );
};
