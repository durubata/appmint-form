import React, { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { classNames } from '../utils'
import { ElementIcon } from './element-icon'
import { Icon } from '../common/icons/list'


export const SelectManyList = (props: { blur, change, focus, mode, schema, path, name, data, value, options, dataPath }) => {
  const [selected, setSelected] = useState<any>()

  useEffect(() => {
    if (props.value) {
      const item = props.options.find(i => i.value === props.value)
      setSelected(item)
    }
  }, [])

  const handleChange = (item) => {
    setSelected(item)
    props.change(item.value)
  }


  return (
    <Listbox value={selected} onChange={handleChange}>
      {({ open }) => (
        <div className="relative  w-full">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 min-h-10 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-5">
            <span className="flex items-center">
              <ElementIcon icon={selected?.icon} image={selected?.image} className="h-10 w-10 flex-shrink-0 rounded-full" mode={props.mode} />
              <span className="ml-3 block truncate">{selected?.label}</span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <Icon name='RiExpandUpDownLine' className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {props.options?.map((item) => {
                const iconOrImage = <ElementIcon icon={item.icon} image={item.image} className="h-5 w-5 flex-shrink-0 rounded-full" mode={props.mode} path={props.path} />

                return (
                  <Listbox.Option
                    key={item.value}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          {iconOrImage}
                          <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}  >
                            {item.label}
                          </span>
                        </div>
                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <Icon name='FaCheck' className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                )
              })}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
