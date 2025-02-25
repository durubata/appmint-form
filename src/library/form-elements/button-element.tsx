import React, { useEffect, useState } from 'react';
import { isEmpty, getFormStore, elementStyleClassMap, classNames, ElementCommonDesign, toTitleCase, toSentenceCase, ElementCommonView, buttonsActions, getElementTheme } from './common-imports';
import { ElementIcon } from './element-icon';

export const ButtonElement = (props: {
  storeId;
  readOnly?;
  mode;
  children;
  path;
  dataPath;
  error?;
  name;
  timestamp?;
  theme?;
  schema?: { readOnly; disabled; theme; validations; hidden; name; title; hideLabel; position; children; image?; icon?; labelPosition; iconPosition?; error?; description; action };
}) => {
  const { path, name, schema, dataPath } = props;
  const { getStateItem, getItemValue, getSchemaItem, updateError } = getFormStore(props.storeId)();

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const errorMsg = props.error || schema.error;
    setErrorMsg(errorMsg);
  }, [path, props.error]);

  if (isEmpty(schema) && isEmpty(props.children)) return null;
  if (isEmpty(schema)) return props.children;

  const iconPosition = schema.iconPosition || 'start';
  let labelPosition = schema.labelPosition || 'auto';
  const labelStartEnd = schema.labelPosition === 'start' || schema.labelPosition === 'end';
  const inlineControls = ['checkbox', 'radio', 'switch', 'button', 'icon-button'];
  const isInline = inlineControls.includes(schema['x-control-variant']);
  const iconStarEnd = !(schema.iconPosition === 'beforeLabel' || schema.iconPosition === 'afterLabel');

  const Wrapper: any = props.mode === 'design' ? ElementCommonDesign : ElementCommonView;

  let info = '';
  if (schema?.validations?.length > 0) {
    const hasMaxLength = schema.validations.find(v => v.validation === 'maxLength');
    const hasMinLength = schema.validations.find(v => v.validation === 'minLength');
    if (hasMaxLength && hasMinLength) {
      info = 'Min ' + hasMinLength.arg + ' Max ' + hasMaxLength.arg;
    } else if (hasMaxLength) {
      info = 'Max ' + hasMaxLength.arg;
    } else if (hasMinLength) {
      info = 'Min ' + hasMinLength.arg;
    }
  }

  const description =
    schema.description || info ? (
      <Wrapper ui={schema['x-ui']} path={path} name={'control-help'} className={classNames(iconStarEnd && labelStartEnd && schema.icon && !isInline && 'ml-8', 'cb-control-error text-gray-500 text-[10px]')}>
        {schema.description || ''} {info}
      </Wrapper>
    ) : null;
  const error = errorMsg ? (
    <Wrapper ui={schema['x-ui']} path={path} name={'control-error'} className="cb-control-help text-xs text-red-400">
      {errorMsg}
    </Wrapper>
  ) : null;
  const icon = schema.icon?.length == 2 ? schema.icon : typeof schema.icon === 'string' ? <ElementIcon icon={schema?.icon} image={schema?.image} mode={props.mode} /> : null;
  const caption = schema.title || schema.name || props.name;
  const label = (
    <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} className={classNames(labelStartEnd && !isInline && '-mt-5', 'cb-label text-xs')}>
      {toSentenceCase(caption)}
    </Wrapper>
  );

  const theme = schema.theme || props.theme;
  const controlTheme = getElementTheme('control', theme);

  const className = classNames(`cb-control  cb-button label-${labelPosition || 'auto'}`, schema.hideLabel && 'hide-label', schema.hidden && ' opacity-60 ', controlTheme.className);

  const clickHandler = async e => {
    updateError(dataPath, null);

    console.log('ButtonElement clickHandler', path, schema);
    if (!schema?.action) {
      console.error('ButtonElement clickHandler no action found', path, schema);
    }

    const actionInfo = buttonsActions[schema.action];
    if (!actionInfo?.fn) {
      console.error('ButtonElement clickHandler no action function found', path, schema);
      return;
    }

    const formData = getItemValue('');
    const formSchema = getSchemaItem('');
    const formRules = getStateItem('formRules');
    const collectionForm = getStateItem('collectionForm');
    const email = getStateItem('email');
    await actionInfo.fn({ storeId: props.storeId, dataPath, actionSchema: schema, email, collectionForm, formData, formSchema, formRules });
  };
  const controlThemeStyle = getElementTheme('button', theme);
  return (
    <Wrapper ui={schema['x-ui']} path={path} name={'control'} className={className}>
      <Wrapper
        ui={schema['x-ui']}
        path={path}
        name={'button'}
        readOnly={props.readOnly || schema.readOnly}
        disabled={schema.disabled}
        className={classNames(elementStyleClassMap['button'], controlThemeStyle.className)}
        tag="button"
        onClick={clickHandler}
      >
        {!['end', 'afterLabel'].includes(iconPosition) && icon}
        {label}
        {['end', 'afterLabel'].includes(iconPosition) && icon}
      </Wrapper>
      {description}
      {error}
    </Wrapper>
  );
};
