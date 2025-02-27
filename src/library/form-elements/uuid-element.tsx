import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IconRenderer } from '../common/icons/icon-renderer';

export const UuidElement = (props: { path; name }) => {
  const prop: any = {};
  const [value, setValue] = React.useState<any>();

  const handleUpdate = () => {
    const uuid = uuidv4();
    setValue(uuid);
  };

  return (
    <div className="flex items-center justify-between page-4 text-sm">
      <span className=" font-serif ">{value}</span>
      <button title="Regenerate" className="button-refresh p-1 rounded-full shadow bg-white" onClick={handleUpdate}>
        <IconRenderer icon="RefreshCcw" />
      </button>
    </div>
  );
};
