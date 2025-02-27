import React from 'react';
import RichTextEditor from '../common/richtext-editor';

export const RichtextElement = (props: { change; focus; blur; mode; value; schema; path; name; data; height?}) => {
  const handleChange = (content: string) => {
    if (props.change) {
      props.change(content);
    }
  };

  const handleBlur = () => {
    if (props.blur) {
      props.blur(props.value);
    }
  };

  const handleFocus = () => {
    if (props.focus) {
      props.focus();
    }
  };

  return (
    <div className="richtext-element-container">
      <RichTextEditor
        value={props.value || ''}
        onChange={handleChange}
        height={props.height || 300}
        menubar="file edit view insert format tools table help"
      />
    </div>
  );
};
