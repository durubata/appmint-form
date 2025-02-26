import { getElementTheme, getFormStore, ElementWrapperLayout, ButtonAdd, getRandomString, isNotEmpty, ButtonDelete, FormRender, FormPicker, classNames } from './common-imports';
import React, { useEffect, useState } from 'react';
import { getWatchedPaths } from './form-utils';
import { runElementRules } from './form-rules';
import { shallow } from 'zustand/shallow';
import { getTemplateValue } from './form-validator';

const defaultTypeValues = type => ({ string: '', number: 0, boolean: false, array: [], object: {} }[type]);

export const FormRenderArray = (props: { storeId; path; dataPath; parentDataPath, childPath; name; fieldName; schema; className; arrayIndex?; hasControl?}) => {
  const { path, dataPath, parentDataPath, name, className, fieldName, childPath, hasControl } = props;

  const { dataPathTimestamp, theme } = getFormStore(props.storeId)(state => ({
    dataPathTimestamp: state.timestamp[dataPath],
    theme: state.theme
  }));
  const { getItemValue, refreshPath, removeArrayValue, getSchemaItem, setItemValue } = getFormStore(props.storeId).getState();

  const [ruleActions, setRuleActions] = useState<any>({});
  useEffect(() => {
    const schema = props.schema || getSchemaItem(path);
    let watchedPaths = getWatchedPaths(schema, parentDataPath, props.arrayIndex);
    if (isNotEmpty(watchedPaths)) {
      getFormStore(props.storeId).getState().updateWatchedPath(props.dataPath, watchedPaths);
    }
    if (schema?.rules) {
      const arrayData = typeof props.arrayIndex === 'number' ? getItemValue(`${props.parentDataPath}`) : null;
      const _ruleActions = runElementRules(schema, getItemValue(''), arrayData);
      setRuleActions(_ruleActions);
    }
  }, []);

  useEffect(() => {
    const schema = props.schema || getSchemaItem(path);
    if (schema?.rules) {
      const parentData = getItemValue(`${props.parentDataPath}`);
      const _ruleActions = runElementRules(schema, getItemValue(''), parentData);
      setRuleActions(_ruleActions);
    }
  }, [dataPathTimestamp]);

  const addArrayItem = (e, itemPath, type = 'string') => {
    const items = getItemValue(itemPath) || [];
    const arrayItemPath = `${itemPath}.${items.length}`;
    setItemValue(arrayItemPath, defaultTypeValues(type));
    refreshPath(dataPath);
  };
  const removeArrayItem = (e, itemPath, index) => {
    removeArrayValue(itemPath, index);
    refreshPath(dataPath);
  };

  const schema = props.schema || getSchemaItem(path);
  if (schema?.hidden || ruleActions.hide) return null;
  if (schema.title) {
    const data = getItemValue('');
    const arrayData = getItemValue(dataPath);
    schema.title = getTemplateValue(schema?.title, parentDataPath, { ...data, ...arrayData });
  }

  let valuePath;
  if (schema.items?.type !== 'array') {
    valuePath = dataPath ? dataPath : fieldName;
  } else {
    valuePath = dataPath ? dataPath + '.' + fieldName : fieldName;
  }
  const items = getItemValue(valuePath) || [''];
  const addButton = (
    <div className="w-full flex my-2 justify-center">
      <ButtonAdd handler={e => addArrayItem(e, valuePath, schema?.items?.type)} className={'w-5 h-5'} />
    </div>
  );
  const arrayTheme = getElementTheme('array', theme);
  const itemPath = path ? path + '.items' : 'items';
  const showIndex = typeof schema.showIndex === 'undefined' ? true : schema.showIndex;

  const arrayControl = (index) => ({
    delete: <ButtonDelete deleteHandler={e => removeArrayItem(e, valuePath, index)} className="shrink-0 w-4 h-4" iconColor='red' unStyled={true} />,
    index: showIndex ? index + 1 : ''
  })
  return (
    <>
      <ElementWrapperLayout mode="view" key={fieldName} path={path} name={fieldName} schema={schema} theme={theme}>
        {items?.map((item, index) => {
          const itemKey = typeof item === 'object' && isNotEmpty(item) ? JSON.stringify(item) : !item ? getRandomString(5) : item;
          const arrayDataPath = `${valuePath}.${index}`;
          const itemsSchema = getSchemaItem(itemPath);
          const itemName = schema.hideItemLabel === 'false' ? fieldName + ' ' + index + 1 : '';
          const render =
            itemsSchema.layout === 'horizontal' ? (
              <div className="relative mb-1 even:bg-cyan-50 flex gap-2 items-center">
                {showIndex && <div className="text-xs">{index + 1}</div>}
                <FormRender key={itemKey} path={itemPath} className="" name={itemName} dataPath={arrayDataPath} parentDataPath={dataPath} arrayIndex={index} storeId={props.storeId} arrayControl={arrayControl(index)} />
                {arrayControl(index).delete}
              </div>
            ) : (
              <div className="relative mb-1 even:bg-cyan-50">
                {!itemsSchema?.collapsible && (
                  <div className={classNames(schema.items?.collapsible && "", "text-xs flex gap-2 items-center justify-between")}>
                    <span>{showIndex ? index + 1 : ''}</span>
                    {arrayControl(index).delete}
                  </div>)}
                <FormRender key={itemKey} path={itemPath} className="" name={itemName} dataPath={arrayDataPath} parentDataPath={dataPath} arrayIndex={index} storeId={props.storeId} arrayControl={arrayControl(index)} />
              </div>
            );
          // if (schema.items?.collapsible && !['string', 'number', 'boolean'].includes(schema?.items?.type)) {
          //   const itemName = schema.hideItemLabel === 'false' ? index + 1 : '';
          //   return (
          //     <ElementWrapperLayout mode="view" path={itemPath} name={itemName} schema={schema.items} theme={theme}>
          //       {render}
          //     </ElementWrapperLayout>
          //   );
          // } else {
          return render;
          // }
        })}
        {addButton}
        {schema.operations?.includes('pick') && <FormPicker dataPath={dataPath} parentDataPath={dataPath} schema={schema} storeId={props.storeId} />}
      </ElementWrapperLayout>
    </>
  );
};
