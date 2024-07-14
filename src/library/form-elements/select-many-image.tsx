import React, { useState } from 'react'
import { ElementIcon } from './element-icon'


export const SelectManyImage = (props: { change, blur, focus, mode, schema, path, name, data, options }) => {
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
    props.change(newValue)
  }

  return (
    <fieldset>
      <legend className="sr-only">Notifications</legend>
      <div className="space-y-5">
        {props.options?.map((item: any) => {
          const isSelected = selections.findIndex(_ => _.value === item.value) > -1
          return (
            <div className="relative flex items-start group">
              <ElementIcon icon={item.icon} image={item.image} className="h-20 w-20 flex-shrink-0 rounded-full" mode={props.mode} path={props.path} />
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
