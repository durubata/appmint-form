import React from 'react';
import { useFormStore } from './form-store';
import { FormElementRender } from '../form-elements';
import { ElementWrapperLayout } from '../form-elements/element-wrapper-layout';
import { ButtonAdd } from '..//common//button-add';
import { FormRender } from './form-render';
import { FormRenderArray } from './form-render-array';
import { ElementCommonView } from '../form-elements/element-common-view';

export const FormLayoutRender = ({ path, dataPath, layoutPath, className = '', arrayIndex }) => {
  const shouldReload = (ov, nv) => {
    return true;
  }
  const { setStateItem, setItemValue, getItemValue, getSchemaItem } = useFormStore(state => state, shouldReload);

  const properties = getSchemaItem(path);

  const onEditItem = (event, itemPath) => {
    event.stopPropagation();
    event.preventDefault();
    setStateItem({ activePath: itemPath });
  };

  const addArrayItem = (e, itemPath) => {
    console.log('addArrayItem', path);
    const items = getItemValue(itemPath) || []
    const arrayItemPath = `${itemPath}.${items.length}`
    setItemValue(arrayItemPath, '')
  }

  console.debug('FormLayoutRender');
  const layoutSchema = getSchemaItem(layoutPath);

  return (
    <ElementCommonView path={layoutPath} name={null} ui={layoutSchema['x-ui']} className={''}>
      <div id={path} data-path={path} onClick={e => onEditItem(e, layoutPath)} className={className}>
        {(
          Object.keys(properties).map(fieldName => {
            const fieldPath = path + '.' + fieldName;
            const { layoutGroup } = (properties[fieldName] || {})
            if (layoutGroup !== layoutPath) return null
            const field = properties[fieldName];
            const valuePath = dataPath ? dataPath + '.' + fieldName : fieldName;
            const hasControl = field['x-control'] && field['x-control'] !== 'container'

            if ((field.type === 'array' || field.type === 'object') && hasControl) {
              return <FormElementRender mode='view' name={fieldName} path={fieldPath} schema={getSchemaItem(fieldPath) || {}} dataPath={valuePath} />
            } else if (field.type === 'array' && !['array', 'object'].includes(field.items.type)) {
              const childPath = path;
              return <FormRenderArray path={fieldPath} dataPath={valuePath} childPath={childPath} name={fieldName} fieldName={fieldName} schema={field} className={className} hasControl={hasControl} />
            } else if (hasControl) {
              return <FormElementRender mode='view' name={fieldName} path={fieldPath} schema={getSchemaItem(fieldPath) || {}} dataPath={valuePath} />
            } else if (field.type === 'object') {
              return (
                <ElementWrapperLayout mode='view' key={fieldName} path={fieldPath} name={fieldName} schema={getSchemaItem(fieldPath)}>
                  <FormRender path={fieldPath} className='' name={fieldName} dataPath={valuePath} />
                </ElementWrapperLayout>
              )
            } else if (field.type === 'array') {
              const items = getItemValue(valuePath) || []
              return (
                <>
                  <ElementWrapperLayout mode='view' key={fieldName} path={fieldPath} name={fieldName} schema={getSchemaItem(fieldPath)}>
                    {items.map((item, index) => {
                      const arrayValuePath = `${valuePath}.${index}`
                      return (
                        <FormRender path={fieldPath} className='' name={fieldName} dataPath={arrayValuePath} />
                      )
                    })}
                  </ElementWrapperLayout>
                  <div className='w-full flex my-2 justify-center'><ButtonAdd handler={e => addArrayItem(e, valuePath)} className={'w-5 h-5'} /></div>
                </>
              )
            } else {
              return <FormElementRender mode='view' name={fieldName} path={fieldPath} schema={getSchemaItem(fieldPath) || {}} dataPath={valuePath} />
            }
          })
        )}
      </div>
    </ElementCommonView>
  );
};
