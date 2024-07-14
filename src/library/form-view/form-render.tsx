import React from 'react';
import { LoadingIndicator } from '../common/loading-indicator';
import { getFormLayout, useFormStore } from './form-store';
import { FormElementRender } from '../form-elements';
import { ElementWrapperLayout } from '../form-elements/element-wrapper-layout';
import { ElementCommonView } from '../form-elements/element-common-view';
import { classNames, isEmpty } from '../utils';
import { FormRenderArray } from './form-render-array';

export const FormRender = (props: { path, dataPath, name, className, arrayIndex?}) => {
  const { path, dataPath, className, arrayIndex } = props;
  const shouldReload = (ov, nv) => {
    return true;
  }
  const { getSchemaItem } = useFormStore(state => state, shouldReload);
  const schema = getSchemaItem(path)
  if (schema?.hidden) return null

  console.log('FormRender', path)

  if (!schema) return <LoadingIndicator />;
  let properties;
  let childPath;
  if (schema.type === 'object') {
    properties = schema.properties;
    childPath = path ? path + '.properties' : 'properties';
  } else if (schema.type === 'array' && schema.items?.type === 'object') {
    properties = schema.items.properties;
    childPath = path ? path + '.items.properties' : 'items.properties';
  } else if (schema.type === 'array') {
    properties = schema.items;
    childPath = path ? path + '.items' : 'items';
  }
  if (!properties) return <div className='text-xs w-full text-center text-red-400'>empty properties</div>

  const RenderWithLayout = getFormLayout(schema)
  if (RenderWithLayout) {
    return <RenderWithLayout path={path + '.properties'} layoutPath={path + '.x-layout'} className={className} dataPath={dataPath} schema={schema} />
  }

  const renderElements = (fieldName, field) => {
    if (isEmpty(field)) return <div className='text-xs w-full text-center text-red-400'>empty field - {fieldName}</div>
    const fieldPath = childPath + '.' + fieldName;
    const valuePath = dataPath ? dataPath + '.' + fieldName : fieldName;
    const hasControl = field['x-control'] && field['x-control'] !== 'container'
    const _schema = getSchemaItem(fieldPath);
    if ((field.type === 'array' || field.type === 'object') && hasControl) {
      return <FormElementRender key={fieldName} mode='view' name={fieldName} path={fieldPath} dataPath={valuePath} />
    } else if (field.type === 'object') {
      return <ElementWrapperLayout mode='view' key={fieldName} path={fieldPath} name={fieldName} schema={_schema}>
        <FormRender path={fieldPath} className='' dataPath={valuePath} name={fieldName} />
      </ElementWrapperLayout>
    } else if (field.type === 'array') {
      return <FormRenderArray path={fieldPath} dataPath={valuePath} childPath={childPath} name={fieldName} fieldName={fieldName} schema={field} className={className} hasControl={hasControl} />
    } else {
      return <FormElementRender key={fieldName} mode='view' name={fieldName} path={fieldPath} dataPath={valuePath} arrayIndex={arrayIndex} />
    }
  }

  if (['string', 'number', 'boolean'].includes(properties.type) || properties['x-control']) {
    return (
      <ElementCommonView key="fieldName" path={path} name={null} ui={schema['x-ui']} className={classNames(className, 'flex gap-3  mx-auto')}>
        <FormElementRender key={path} mode='view' name={props.name} path={path} dataPath={dataPath} arrayIndex={arrayIndex} />
      </ElementCommonView>
    )
  }


  const render = (
    <ElementCommonView path={path} name={path ? null : 'cb-form-root'} ui={schema['x-ui']}>
      {Object.keys(properties).map(fieldName => {
        const field = properties[fieldName];
        if (!field) return console.error('field not found', fieldName, properties);
        if (field.group) {
          const groupFields = Object.keys(properties).filter(key => properties[key] && properties[key].group === field.group).map(key => ({ key, field: properties[key] }))
          const fieldIndex = groupFields.findIndex(f => f.key === fieldName);
          if (fieldIndex !== 0) return null;
          const groupPath = childPath + '.' + field.group;
          return (
            <ElementCommonView key={groupPath} path={groupPath} name={null} ui={schema['x-ui']} className={'flex gap-3  mx-auto'}>
              {groupFields.map(({ key, field }) => {
                return (renderElements(key, field))
              })}
            </ElementCommonView>
          )
        } else {
          return (renderElements(fieldName, field))
        }
      })}
    </ElementCommonView>
  );

  return render;
};

