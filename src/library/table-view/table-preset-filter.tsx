import React, { useState } from 'react';
import { SelectManyCombo } from '../form-elements/select-many-combo';

export const TablePresetFilter: React.FC<any> = ({ filterPreset }) => {
  const [filter, setFilter] = useState(filterPreset.default);

  const onChange = value => {
    console.log(value);
  };

  return (
    <div className="w-full max-w-96">
      <SelectManyCombo options={filterPreset.options?.map(i => ({ label: i, value: i }))} value={filter} change={onChange} schema={{ placeholder: `Filter ${filterPreset.property}` }} />
    </div>
  );
};
