import React, { useEffect } from 'react';
import { SelectManyList } from './select-many-list';
import { SelectManyCombo } from './select-many-combo';
import { SelectManyRadio } from './select-many-radio';
import { SelectManyCheckbox } from './select-many-checkbox';
import { SelectManySwitch } from './select-many-switch';
import { getDataOptions, getWatchedPaths } from '../converters/data-store';
import { SelectManyImage } from './select-many-image';
import { isEmpty, isNotEmpty } from '../utils';
import { useFormStore } from '../form-view/form-store';

const selectList = {
  'select': SelectManyList,
  'combo': SelectManyCombo,
  'radio': SelectManyRadio,
  'checkbox': SelectManyCheckbox,
  'switch': SelectManySwitch,
  'image': SelectManyImage
}

export const SelectManyElement = (props: { blur, change, focus, mode, schema, path, name, data, value, dataPath }) => {
  const [options, setOptions] = React.useState([])

  const dataString = JSON.stringify(props.data)
  useEffect(() => {
    if (props.schema?.options) {
      setOptions(checkAndFixOptions(props.schema?.options))
    } else if (props.schema?.dataSource) {
      (async () => {
        const dataOptions = await getDataOptions(props.schema.dataSource, props.data)
        setOptions(checkAndFixOptions(dataOptions))
      })()
    }
    const pathsToWatch = getWatchedPaths(props.schema?.dataSource)
    if (isNotEmpty(pathsToWatch)) {
      useFormStore.getState().updateWatchedPath(props.dataPath, pathsToWatch)
    }
  }, [dataString, props.schema])

  const checkAndFixOptions = (options) => {
    if (!Array.isArray(options) || isEmpty(options)) return []
    if (typeof options[0] === 'string') {
      return options.map(o => ({ label: o, value: o }))
    } else {
      return options
    }
  }

  const onChange = (value) => {
    if (props.change) {
      if (props.schema.type === 'string' && typeof value !== 'string') {
        props.change(JSON.stringify(value))
      } else {
        props.change(value)
      }
    }
  }

  const onBlur = (value) => {
    if (props.change) {
      if (props.schema.type === 'string' && typeof value !== 'string') {
        props.blur(JSON.stringify(value))
      } if (props.schema.type === 'array' && typeof value === 'string') {
        props.blur(JSON.parse(value))
      } else {
        props.blur(value)

      }
    }
  }

  const onFocus = (value) => {
  }

  let variant = props.schema['x-control-variant']
  const defaultElement = props.schema.type === 'array' ? selectList.combo : selectList.select
  const Element = selectList[variant] || defaultElement
  return (
    <Element path={props.path} dataPath={props.dataPath} name={props.name} schema={props.schema} mode={props.mode}
      options={Array.isArray(options) ? options : []}
      blur={onBlur}
      change={onChange}
      focus={onFocus}
      value={props.value} />
  );
};
