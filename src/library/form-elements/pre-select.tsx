import React, { useEffect, useState } from 'react'
import { classNames } from '../utils'
import { getDataOptions } from '../converters/data-store'
import { ElementIcon } from './element-icon'

export const PreSelectElement = (props: { update, mode, schema, path, name, data, options }) => {
  const [selections, setSelections] = useState<any[]>([])
  const [checked, setChecked] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([])

  const dataString = JSON.stringify(props.data)

  useEffect(() => {
    if (props.schema?.options) {
      setOptions(props.schema.options)
    } else if (props.schema?.dataSource) {
      (async () => {
        const dataOptions = await getDataOptions(props.schema.dataSource, props.data)
        setOptions(dataOptions)
      })()
    }
  }, [dataString, props.schema])

  const updateSelections = (item) => {
    if (selections.findIndex(_ => _.value === item.value) > -1) {
      setSelections(selections.filter((selection) => selection.value !== item.value))
    } else {
      setSelections([...selections, item])
    }
  }

  const handleClick = (e, option) => {
    const isChecked = checked?.find((item: any) => item.value === option.value)
    if (isChecked) {
      setChecked(checked.filter((item: any) => item.value !== option.value))
    } else {
      setChecked([...checked, option])
    }
  }

  const handleUpdate = (e) => {
    props.update(e.target.value)
  }

  const variant = props.schema.variant || 'text'


  return (
    <fieldset>
      <legend className="sr-only">Notifications</legend>
      <div className="space-y-5">
        {checked?.map((item: any, index) => {
          const isSelected = selections.findIndex(_ => _.value === item.value) > -1
          const iconOrImage = <ElementIcon icon={item.icon} image={item.image} className="h-10 w-10 mr-3 flex-shrink-0 rounded-full" mode={props.mode} path={props.path} />
          return (
            <div key={index} className="relative flex items-center group ">
              {iconOrImage}
              <div className={classNames("flex items-center w-full  rounded border-0 text-gray-900 bg-white/20 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5")}
              >
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">{item.label}</span>
                <input
                  onChange={handleUpdate}
                  value={''}
                  disabled={props.schema.disabled}
                  readOnly={props.schema.readOnly}
                  type={variant}
                  name={props.name}
                  id={props.path}
                  className={'w-full flex-1 border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-5'}
                  placeholder={props.schema.placeholder}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className='flex flex-wrap items-center justify-start mt-10 shadow'>
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className={classNames(checked?.find((item: any) => item.value === option.value) ? ' bg-cyan-400' : '', `relative  items-center m-2 p-2 rounded-full shadow cursor-pointer`)}
              onClick={e => handleClick(e, option)}
            >
              {option.image && (
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={option.image}
                  alt=""
                />
              )}
              {option.label && !option['x-hide-label'] &&
                <div className="min-w-0 flex-1 text-sm leading-6">
                  (
                  <label htmlFor="candidates" className="font-medium text-gray-900">
                    {option.label}
                  </label>
                  )
                  {option.description && (
                    <p id="candidates-description" className="text-gray-500">
                      {option.description}
                    </p>
                  )}
                </div>
              }
              <input
                id="candidates"
                aria-describedby="candidates-description"
                name={option.value}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 hidden"
                checked={checked?.includes(option.value)}
                onChange={() => { }}
              />
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
