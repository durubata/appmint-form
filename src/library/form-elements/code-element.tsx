import React from 'react';
import { MonacoCodeEditor } from '../common/monaco-editor';

export const CodeElement = (props: { readOnly?; change; focus; blur; mode; value; width?; height?; schema; path; name; data }) => {
  const saveChanges = (name, data) => {
    if (props.blur) {
      props.blur(data);
    }
  };

  const onChange = (update) => {
    if (props.change) {
      props.change(update);
    }
  };

  let variant = props.schema['x-control-variant'];

  return (
    <div className="code-element-container">
      <MonacoCodeEditor
        value={props.value}
        mode={props.mode || 'javascript'}
        onChange={onChange}
        save={saveChanges}
        name={props.name}
        width={props.width}
        height={props.height || 300}
        showAppBar={true}
        expandable={true}
      />
    </div>
  );
};
