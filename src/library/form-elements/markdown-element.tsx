import React from 'react';
import MarkdownEditor from '../common/markdown-editor';

export const MarkdownElement = (props: { path; name; validate; value; change; blur; className; ui; theme; height?}) => {
  const handleChange = (value: string) => {
    if (props.change) {
      props.change(value);
    }
  };

  const handleBlur = () => {
    if (props.blur) {
      props.blur(props.value);
    }
  };

  return (
    <div className={props.className || "markdown-element-container"}>
      <MarkdownEditor
        value={props.value || ''}
        onChange={handleChange}
        height={props.height || 300}
        preview="live"
      />
    </div>
  );
};
