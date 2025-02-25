import { MonacoCodeEditor } from './common-imports';
import React from 'react';

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
    <MonacoCodeEditor save={undefined} onChange={onChange} mode={variant} width={props?.width || '100%'} height={props?.height || 400} value={props.value} showAppBar={false} name={props.name} />
  );
};
