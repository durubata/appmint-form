import React from 'react';

export const RichtextElement = (props: { change; focus; blur; mode; value; schema; path; name; data }) => {
  const prop: any = {};

  const handleBlur = (id, content) => {
    props.blur(content);
  };

  const handleChange = content => {
    props.change(content);
  };

  const handleFocus = () => { };

  return <div>
    <div className="flex items-center justify-between page-4 text-sm">
      <span className=" font-serif ">Richtext</span>
    </div>
  </div>
};
