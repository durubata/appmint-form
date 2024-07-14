import React from 'react';
import { useFormStore } from './form-store';
import { ElementWrapperLayout } from '../form-elements/element-wrapper-layout';
import { ButtonAdd } from '..//common//button-add';
import { getRandomString, isNotEmpty } from '../utils';
import { ButtonDelete } from '..//common//button-delete';
import { FormRender } from './form-render';
import { FormPicker } from './form-picker';

const defaultTypeValues = (type) => ({ 'string': '', 'number': 0, 'boolean': false, 'array': [], 'object': {} })[type]

export const FormRenderArray = (props: { path, dataPath, childPath, name, fieldName, schema, className, arrayIndex?, hasControl?}) => {
  const { path, dataPath, name, className, fieldName, schema, childPath, hasControl } = props;
  const shouldReload = (ov, nv) => {
    if (ov.timestamp[dataPath] !== nv.timestamp[dataPath]) return false;
    return true;
  }
  const { setStateItem, getSchemaItem, getItemValue, setItemValue, refreshPath, removeArrayValue } = useFormStore(state => state, shouldReload);

  const addArrayItem = (e, itemPath, type = 'string') => {
    const items = getItemValue(itemPath) || []
    const arrayItemPath = `${itemPath}.${items.length}`
    setItemValue(arrayItemPath, defaultTypeValues(type))
    refreshPath(dataPath)
  }
  const removeArrayItem = (e, itemPath, index) => {
    removeArrayValue(itemPath, index)
    refreshPath(dataPath)
  }

  const fieldPath = childPath + '.' + fieldName;
  let valuePath;
  if (schema.items.type !== 'array') {
    valuePath = dataPath ? dataPath : fieldName;
  } else {
    valuePath = dataPath ? dataPath + '.' + fieldName : fieldName;
  }
  const items = getItemValue(valuePath) || ['']
  const addButton = <div className='w-full flex my-2 justify-center'><ButtonAdd handler={e => addArrayItem(e, valuePath, schema?.items?.type)} className={'w-5 h-5'} /></div>;
  if (hasControl) {
    return (
      <ElementWrapperLayout mode='view' key={fieldName} path={fieldPath} name={fieldName} schema={getSchemaItem(fieldPath)}>
        {items?.map((item, index) => {
          const arrayValuePath = `${valuePath}.${index}`
          const itemKey = typeof item === 'object' && isNotEmpty(item) ? JSON.stringify(item) : !item ? getRandomString(5) : item
          return (
            <div key={itemKey} className='relative flex gap-1 items-center mb-4 even:bg-cyan-50 p-2'>
              <div className='text-sm flex-shrink-0'>{index + 1}</div>
              <div className='w-full'>
                <FormRender key={itemKey} path={fieldPath} className=' w-full mb-0' name={''} dataPath={arrayValuePath} arrayIndex={index} />
              </div>
              <ButtonDelete deleteHandler={e => removeArrayItem(e, valuePath, index)} className='shrink-0 w-4 h-4 ' />
            </div>
          )
        })}
        {addButton}
        {schema.operations?.includes('pick') && <FormPicker dataPath={dataPath} schema={schema} />}
      </ElementWrapperLayout>
    )
  }

  return (
    <>
      <ElementWrapperLayout mode='view' key={fieldName} path={fieldPath} name={fieldName} schema={getSchemaItem(fieldPath)}>
        {items?.map((item, index) => {
          const itemKey = typeof item === 'object' && isNotEmpty(item) ? JSON.stringify(item) : !item ? getRandomString(5) : item
          const arrayValuePath = `${valuePath}.${index}`
          return (
            <div className='relative mb-4 even:bg-cyan-50 p-2'>
              <div className='text-xs'>{index + 1}</div>
              <FormRender key={itemKey} path={fieldPath} className='' name={fieldName} dataPath={arrayValuePath} arrayIndex={index} />
              <ButtonDelete deleteHandler={e => removeArrayItem(e, valuePath, index)} className='shrink-0 w-4 h-4 absolute right-0 top-1' />
            </div>
          )
        })}
        {addButton}
        {schema.operations?.includes('pick') && <FormPicker dataPath={dataPath} schema={schema} />}
      </ElementWrapperLayout>
    </>
  )
};

