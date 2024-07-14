import React, { useState } from 'react'
import { ElementIcon } from './element-icon'


export const SelectManyCheckbox = (props: { blur, focus, mode, schema, path, name, data, options }) => {
  const [query, setQuery] = useState('')
  const [selections, setSelections] = useState<any[]>([])

  const updateSelections = (item) => {
    let newValue;
    if (selections.findIndex(_ => _.value === item.value) > -1) {
      newValue = selections.filter((selection) => selection.value !== item.value)
      setSelections(newValue)
    } else {
      newValue = [...selections, item]
      setSelections(newValue)
    }
    props.blur(newValue)
  }

  return (
    <fieldset>
      <legend className="sr-only">Notifications</legend>
      <div className="space-y-5">
        {props.options?.map((item: any) => {
          const isSelected = selections.findIndex(_ => _.value === item.value) > -1
          const iconOrImage = <ElementIcon icon={item.icon} image={item.image} className="h-10 w-10 flex-shrink-0 rounded-full" mode={props.mode} path={props.path} />
          return (
            <div className="relative flex items-start group">
              {iconOrImage}
              <div className="flex h-6 items-center">
                <input id={item.value} aria-describedby="comments-description" onChange={e => updateSelections(item)} checked={isSelected} name={item.label} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="comments" className="font-medium text-gray-900">
                  {item.label}
                </label>
                <p id="comments-description" className="text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
