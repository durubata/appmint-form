import React from 'react';
import { RichEditor } from '../common/rich-editor';

export const RichtextElement = (props: { change, focus, blur, mode, value, schema, path, name, data }) => {
  const prop: any = {}

  const handleBlur = (id, content) => {
    props.blur(content)
  };

  const handleChange = (content) => {
    props.change(content)
  };

  const handleFocus = () => {
  };


  return (
    <div >
      <RichEditor id={prop.name} data={props.value} updateContent={handleBlur} inline={false} immediate={false} height={prop.css?.height} />
    </div>
  );
};
