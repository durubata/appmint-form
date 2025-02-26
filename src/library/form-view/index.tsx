// Removed unused import
import { getElementTheme, getFormStore, LoadingIndicator, ElementCommonView, FormRender, classNames, deepCopy, validateForm, FormCollapsible, isNotEmpty, tabButtonActiveClass, tabButtonClass } from './common-imports';
import React, { useEffect } from 'react';

export const CollectionForm = (props: { demo?; data?; path?; title?; schema?; rules?; theme?; accessMode?; id?; datatype?; icon?; readOnly?; hash?; useAI?; collapsible?; onChange?: (path, value, data, files, error) => void }) => {
  const storeId = props.id || props.hash;
  const { formRef, activePage } = getFormStore(storeId)((state) => ({
    formRef: state.storeId,
    activePage: state.activePage
  }));
  const { schema, initForm, getItemValue, getSchemaItem, setStateItem, getError, updateError } = getFormStore(storeId).getState();


  useEffect(() => {
    const { data = {}, path, schema, rules, theme, accessMode, datatype, onChange, readOnly } = props;
    const oldData = getItemValue();
    initForm({ data, path, schema, rules, theme, accessMode, storeId, datatype, onChangeCallback: onChange, readOnly });
    const timestamp = {};
    if (isNotEmpty(oldData)) {
      Object.keys(oldData).forEach(k => {
        if (typeof oldData[k] === 'object' && isNotEmpty(oldData[k])) {
          Object.keys(oldData[k]).forEach(kk => {
            timestamp[`${k}.${kk}`] = Date.now();
          });
        } else {
          timestamp[k] = Date.now();
        }
      });
    }
    setStateItem({ timestamp });
  }, [storeId, props.id, props.hash]);

  const setPage = page => {
    setStateItem({ activePage: page, error: {} });
  };

  const prevPage = () => {
    if (activePage === 0) return;
    const _activePage = activePage - 1;
    setStateItem({ activePage: _activePage, error: {} });
  };

  const nextPage = () => {
    updateError('root', null);

    const errors = getError();
    if (errors && Object.keys(errors).length > 0) {
      const allErrors = Object.keys(errors)
        .filter(k => k !== 'root')
        .map(k => errors[k])
        .join(', ');
      updateError('root', allErrors);
      return;
    }
    const targetSchema = getSchemaItem('');
    const thisSchema: any = { type: targetSchema.type };
    if (targetSchema.type === 'object') {
      thisSchema.properties = deepCopy(targetSchema.properties);
    } else if (targetSchema.type === 'array' && targetSchema.items?.type === 'object') {
      thisSchema.items = deepCopy(targetSchema.items);
    } else if (targetSchema.type === 'array') {
      thisSchema.items = deepCopy(targetSchema.items);
      thisSchema.items.required = targetSchema.items.inputRequired ? [targetSchema.items.name] : [];
    }
    const validationResult = validateForm(getItemValue(''), thisSchema);
    if (validationResult.valid) {
      if (activePage === schema?.pages?.length - 1) {
        console.log('submit');
        return;
      } else {
        const _activePage = activePage + 1;
        setStateItem({ activePage: _activePage });
      }
    } else {
      updateError('root', validationResult.message);
    }
  };

  const aiUpdate = data => {
    getFormStore(storeId)
      .getState()
      .setStateItem({ data: data, timestamp: { ...getFormStore(storeId).getState().timestamp, ['root']: Date.now() } });
  };

  const aiGetContent = () => {
    return schema;
  };

  if (!schema)
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div className="text-xs text-red-400 text-center ">no schema defined</div>
        <LoadingIndicator />
      </div>
    );

  const path = activePage > 0 ? 'pages.' + activePage : '';
  const errorMsg = getError('root');
  const formTheme = getElementTheme('form', props.theme);
  const titleTheme = getElementTheme('title', props.theme);
  const title = props.title || schema.title;
  const collapsible = props.collapsible || schema.collapsible;

  let tabHeaders = null;
  let pager = null;
  const hasPages = schema?.pages?.length > 1;
  if (hasPages && schema?.theme?.paging === 'tab') {
    tabHeaders = (
      <div className="flex gap-5 items-center justify-start p-2">
        {schema?.pages?.map((page, idx) => {
          return (
            <button key={idx} title={page.title || `Page ${idx + 1}`} onClick={e => setPage(idx)} className={classNames(idx === activePage ? tabButtonActiveClass + ' text-gray-600' : 'text-gray-400 hover:text-gray-600', tabButtonClass)}>
              {page.title || `Page ${idx + 1}`}
            </button>
          );
        })}
      </div>
    );
  } else if (hasPages) {
    pager = (
      <div className="flex justify-between text-sm my-2">
        <button className={classNames(activePage === 0 && 'disabled', ' hover:bg-gray-100 disabled:hover:bg-white py-1 px-4 rounded-lg shadow disabled:text-gray-200')} onClick={prevPage}>
          Back
        </button>
        <button className="hover:bg-gray-100 py-1 px-4 rounded-lg shadow" onClick={nextPage}>
          {activePage === schema?.pages?.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    );
  }

  const render = (
    <div className="w-full mt-2" data-theme={props.theme}>
      {tabHeaders}
      {!collapsible && title && (
        <ElementCommonView path="" theme={props.theme} name="cb-form-title" ui={schema['x-ui']} className={classNames('text-base font-semibold text-center', titleTheme.className)}>
          {title}
        </ElementCommonView>
      )}
      <ElementCommonView id={props.datatype} path="" name="cb-form" ui={schema['x-ui']} theme={props.theme} className={classNames(formTheme.className, ' cb-form ')}>
        {errorMsg && (
          <ElementCommonView ui={schema['x-ui']} path="" name="cb-form-error" className="cb-control-help text-xs text-red-400 max-w-screen-sm mx-auto">
            <ul>
              {errorMsg.split('\n').map(line => (
                <li>{line}</li>
              ))}
            </ul>
          </ElementCommonView>
        )}
        <FormRender path={props.path || path} className="h-full w-full" name={''} dataPath={''} storeId={storeId} />
      </ElementCommonView>
      {pager}
    </div>
  );

  if (collapsible) {
    return (
      <FormCollapsible id={storeId} title={title} icon={props.icon}>
        {render}
      </FormCollapsible>
    );
  }

  return render;
};

export default CollectionForm;
