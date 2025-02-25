import React from 'react';

export const ColorElement = (props: { path, name }) => {
  const prop: any = {}

  const handleUpdate = () => {
  };

  return (
    <div>
      <CommonColorPicker style={prop.css} className='' type={prop['x-control-variant']} icon={<Icon name='MdFormatColorFill' />} toggle={prop.displayStyle === 'button'} floatBoxPos={prop.position} useFloatBox={prop.displayStyle === 'button'} updateColor={handleUpdate} color={prop.value} />{/* <ColorPicker palette={palette} onChange={handleChange} value={value} defaultValue={value} /> */}
    </div>
  );
};
