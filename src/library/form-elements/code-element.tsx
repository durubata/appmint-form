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
  return (<div>
    CodeElement
  </div>
  );
};
