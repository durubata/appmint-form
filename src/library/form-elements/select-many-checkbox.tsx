import React, { useState } from 'react';
import { ElementIcon } from './element-icon';
import { classNames } from '../utils';
import { SwitchElement } from './switch-element';

export const SelectManyCheckbox = (props: { blur; focus; mode; schema; path; name; data; options, variant }) => {
  const [selections, setSelections] = useState<any[]>([]);

  const updateSelections = item => {
    if (!item) return;
    let newValue;
    if (selections.findIndex(_ => _.value === item.value) > -1) {
      newValue = selections.filter(selection => selection.value !== item.value);
      setSelections(newValue);
    } else {
      newValue = [...selections, item];
      setSelections(newValue);
    }
    props.blur(newValue);
  };

  const hideOptionLabel = props.schema ? props.schema['x-hide-option-label'] : undefined;
  const optionDirection = props.schema ? props.schema['x-hide-option-direction'] : undefined;
  const getInputType = (item, isSelected) => {
    if (props.variant === 'switch') {
      return <div><SwitchElement change={e => updateSelections(item)} value={isSelected} mode={props.mode} schema={props.schema} path={props.path} name={props.name} data={props.data} /></div>
    } else if (props.variant === 'checkbox') {
      return (<div>
        <input
          id={item.value}
          aria-describedby="comments-description"
          onChange={e => updateSelections(item)}
          checked={isSelected}
          name={item.label}
          type="checkbox"
          className={classNames("h-4 w-4 min-w-4 min-h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600")}
        />
      </div>)
    }
    return <></>;
  }

  return (
    <fieldset>
      <legend className="sr-only">Notifications</legend>
      <div className={classNames(optionDirection === 'horizontal' ? 'flex gap-2 flex-wrap' : 'space-y-3', "")}>
        {props.options?.map((item: any) => {
          const isSelected = selections.findIndex(_ => _.value === item.value) > -1;
          return (
            <button className={classNames(isSelected ? "bg-cyan-100" : "", optionDirection === 'horizontal' ? 'w-fit p-2' : 'w-full px-2 py-1', "relative block group border-gray-200 text-xs border rounded-lg")} onClick={() => updateSelections(item)}>
              <div className='flex gap-3 items-center'>
                <ElementIcon icon={item.icon} image={item.image} className="flex-shrink-0 rounded-full" mode={props.mode} path={props.path} />
                {getInputType(item, isSelected)}
                {item.label && !hideOptionLabel && (
                  <label htmlFor="comments" className="text-sm text-gray-900">
                    {item.label}
                  </label>
                )}
              </div>
              {item.description && (
                <p id="comments-description" className="text-gray-500 text-xs">
                  {item.description}
                </p>)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};
