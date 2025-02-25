import { CommonColorPicker, getElementTheme, twMerge } from './common-imports';
import React from 'react';

export const ColorElement = (props: { path; name; value; blur, schema, theme, className }) => {
  const prop: any = {};

  const handleUpdate = color => {
    if (props.blur) {
      props.blur(color?.hex || color);
    }
  };

  const { position, displayStyle, popup, icon, toggle } = props.schema || {};
  const variant = props.schema ? props.schema['x-control-variant'] : 'text';

  return (
    <CommonColorPicker
      className={twMerge("p-1 rounded ", props.className)}
      type={variant}
      icon={icon || 'MdFormatColorFill'}
      toggle={toggle}
      floatBoxPos={position}
      useFloatBox={displayStyle === 'button'}
      updateColor={handleUpdate}
      color={props.value}
    />
  );
};
{/* <ColorPicker palette={palette} onChange={handleChange} value={value} defaultValue={value} /> */ }
