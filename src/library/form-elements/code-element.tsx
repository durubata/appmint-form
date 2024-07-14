import React from 'react';
import { MonacoCodeEditor } from '../common/code-editor';

export const CodeElement = (props: { path, name }) => {
  const prop: any = {}

  const handleUpdate = () => {
  };

  return (
    <div>
      <MonacoCodeEditor save={handleUpdate} mode={prop['x-control-variant']} width={prop?.width || '100%'} height={prop?.height || 300} value={prop.value} showAppBar={false} name={props.name} />
    </div>
  );
};
