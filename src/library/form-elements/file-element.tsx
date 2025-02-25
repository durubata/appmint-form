import React from 'react';
import { CommonFilePicker } from 'components/common/input/CommonFilePicker';
import { CustomFileUpload } from 'components/common/input/CommonFileUpload';
import { isNotEmpty } from '../utils';

export const FileElement = (props: { change; focus; blur; mode; value; schema; path; name; data }) => {
  let eValue;
  if (isNotEmpty(props.value)) {
    if (Array.isArray(props.value)) {
      if (props.value[0].path) {
        eValue = props.value;
      } else {
        eValue = props.value.map(v => ({ path: v, url: v }));
      }
    } else if (typeof props.value === 'object') {
      eValue = [props.value];
    } else if (typeof props.value === 'string') {
      eValue = [{ path: props.value, url: props.value }];
    }
  }

  const handleFilePicked = (files: { path: string; url: string }[]) => {
    const simpleFiles = files?.map(file => ({ path: file.path, url: file.url }));
    const [_file] = simpleFiles || [];
    if (props.schema.type === 'array') {
      props.blur(simpleFiles);
    } else if (props.schema.type === 'object') {
      props.blur(_file);
    } else {
      props.blur(_file?.url || '');
    }
  };

  const handleFileUpload = data => {
    const file = { path: data.path, url: data.url };
    if (props.schema.type === 'array') {
      if (eValue.length >= props.schema.maxItems) return;
      const newFiles = [...(eValue || []), file];
      props.blur(newFiles);
    } else if (props.schema.type === 'object') {
      props.blur(file);
    } else {
      props.blur(file.url);
    }
  };

  const variant = props.schema['x-control-variant'] || 'file';
  if (variant === 'upload') {
    return (
      <div>
        <CustomFileUpload location={'/'} onFileUpload={handleFileUpload} />
      </div>
    );
  }

  const max = props.schema.type === 'object' ? 1 : props.schema.maxItems ? props.schema.maxItems : undefined;
  return (
    <div className="w-full shadow border-white border-8 bg-gray-50 p-10">
      <CommonFilePicker files={eValue} handleFilePicked={handleFilePicked} max={max} hideSelection={props.schema?.hideSelection} />
    </div>
  );
};
