import { RichEditor } from './common-imports';
import React from 'react';

export const RichtextElement = (props: { change; focus; blur; mode; value; schema; path; name; data }) => {
  const prop: any = {};

  const handleBlur = (id, content) => {
    props.blur(content);
  };

  const handleChange = content => {
    props.change(content);
  };

  const handleFocus = () => {};

  return <RichEditor id={prop.name} data={props.value} updateContent={handleBlur} inline={false} immediate={false} height={prop.css?.height} className={'w-full'} />;
};
