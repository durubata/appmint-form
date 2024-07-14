import React, { useEffect, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { classNames, isEmpty } from '../utils'
import { ElementIcon } from './element-icon'
import { Icon } from '../common/icons/list'

export const SelectManyCombo = (props: { blur, change, focus, mode, schema, path, name, data, options }) => {
  const [query, setQuery] = useState('')
  const [selections, setSelections] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([])


  useEffect(() => {
    const options: any = [{ label: '', value: '' }, ...(props.options || [])]
    setOptions(options)
  }, [props.options])

  const filterOptions =
    query === ''
      ? options
      : options.filter((item) => {
        return item.label.toLowerCase().includes(query.toLowerCase()) || item.value.toLowerCase().includes(query.toLowerCase())
      })

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

  const addNewItem = event => {

    if (isEmpty(query)) return
    setOptions([...options, { value: query, label: query }])
    const newItem = { value: query, label: query };
    const newOptions = [...selections, newItem];
    setSelections(newOptions);
    setQuery('');
  }

  return (
    <Combobox as="div" value={null} onChange={updateSelections} className={'w-full'}>
      <div className="relative">
        <div className=' flex flex-wrap text-xs gap-2 p-1'>
          {selections.map((item) => (
            <div key={item.value} className="flex items-center px-2 py-1 rounded-full shadow bg-gray-50">
              <ElementIcon icon={item.icon} image={item.image} className="h-5 w-5 flex-shrink-0 rounded-full" mode={props.mode} />
              <span className="ml-3 block truncate">{item.label}</span>
              <button onClick={() => updateSelections(item)} className="ml-3 text-gray-400 bg-white hover:text-gray-600 focus:outline-none rounded-full shadow p-[2px]">
                <span className="sr-only">Remove</span>
                <Icon name='FaXmark' className="h-4 w-4 hover:fill-red-500 hover:stroke-red-500" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <div className="relative">
          <Combobox.Input
            className="w-full rounded border-0 bg-white pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(item: any) => item?.value}
          />
          <Combobox.Button className="absolute inset-y-0 right-6 flex items-center rounded-r-md px-2 focus:outline-none" onClick={addNewItem}>
            <Icon name='FaPlus' className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        {filterOptions.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filterOptions.map((item) => {
              const isSelected = selections.findIndex(_ => _.value === item.value) > -1
              if (isSelected) return null
              const iconOrImage = <ElementIcon icon={item.icon} image={item.image} className="h-10 w-10 flex-shrink-0 rounded-full" mode={props.mode} path={props.path} />
              return (
                <Combobox.Option
                  key={item.value}
                  value={item}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <div className="flex items-center">
                        {iconOrImage}
                        <span className={classNames('ml-3 truncate', isSelected && 'font-semibold')}>{item.label}</span>
                      </div>
                      {isSelected && (
                        <span className={classNames('absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600')}   >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              )
            })}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
