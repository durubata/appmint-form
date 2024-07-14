import React, { useEffect, useState } from 'react';
import { ElementIcon } from './element-icon';
import { classNames, isEmpty, toSentenceCase, toTitleCase } from '../utils';
import { ElementCommonView } from './element-common-view';

export const ElementWrapperControl = (props: { mode, children, path, error?, name, theme?, schema?: { validations, hidden, name, title, hideLabel, position, children, image?, icon?, labelPosition, iconPosition?, error?, description } }) => {
  const { path, name, schema } = props;

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const errorMsg = props.error || schema.error;
    setErrorMsg(errorMsg);
  }, [path, props.error]);


  if (isEmpty(schema) && isEmpty(props.children)) return null;
  if (isEmpty(schema)) return props.children;

  const iconPosition = schema.iconPosition || 'start';
  const labelPosition = schema.labelPosition || 'top';
  const labelStartEnd = schema.labelPosition === 'start' || schema.labelPosition === 'end';
  const inlineControls = ['checkbox', 'radio', 'switch', 'button', 'icon-button']
  const isInline = inlineControls.includes(schema['x-control-variant']);
  const iconStarEnd = !(schema.iconPosition === 'beforeLabel' || schema.iconPosition === 'afterLabel')



  const Wrapper: any = props.mode === ElementCommonView

  let info = '';
  if (schema?.validations?.length > 0) {
    const hasMaxLength = schema.validations.find(v => v.validation === 'maxLength');
    const hasMinLength = schema.validations.find(v => v.validation === 'minLength');
    if (hasMaxLength && hasMinLength) {
      info = 'Min ' + hasMinLength.arg + ' Max ' + hasMaxLength.arg
    } else if (hasMaxLength) {
      info = 'Max ' + hasMaxLength.arg
    } else if (hasMinLength) {
      info = 'Min ' + hasMinLength.arg
    }
  }

  const description = (schema.description || info) ? <Wrapper ui={schema['x-ui']} path={path} name={'control-help'} className={classNames(iconStarEnd && labelStartEnd && schema.icon && !isInline && 'ml-8', 'cb-control-error text-gray-500 text-[10px]')}>{schema.description || ''} {info}</Wrapper> : null;
  const error = errorMsg ? <Wrapper ui={schema['x-ui']} path={path} name={'control-error'} className='cb-control-help text-xs text-red-400'>{errorMsg}</Wrapper> : null;
  const icon = schema.icon?.length == 2 ? schema.icon : typeof schema.icon === 'string' ? <ElementIcon icon={schema?.icon} image={schema?.image} mode={props.mode} /> : null;
  let element;
  if (icon && (iconPosition === 'start' || iconPosition === 'end')) {
    element = <Wrapper ui={schema['x-ui']} path={path} name={'input'} className={classNames(isInline ? 'w-fit' : 'w-full', 'cb-input my-1 flex gap-2 items-center')}>{iconPosition === 'start' && icon}  {props.children} {iconPosition === 'end' && icon} </Wrapper>
  } else {
    element = <Wrapper ui={schema['x-ui']} path={path} name={'input'} className={classNames(isInline ? 'w-fit' : 'w-full', 'my-1 cb-input')}> {props.children} </Wrapper>
  }

  let label;
  const caption = schema.title || schema.name || props.name;

  if (caption && !schema.hideLabel) {
    if (iconPosition === 'beforeLabel' || iconPosition === 'afterLabel') {
      label = <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} className={classNames(labelStartEnd && !isInline && '-mt-5', 'cb-label-with-icon flex gap-2 text-xs items-center')}> {iconPosition === 'beforeLabel' && icon} <Wrapper path={path} name={name} className=' cb-label' >{toTitleCase(toSentenceCase(caption))}</Wrapper>{iconPosition === 'afterLabel' && icon}  </Wrapper>
    } else {
      label = <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} className={classNames(labelStartEnd && !isInline && '-mt-5', 'cb-label text-xs')}>{toTitleCase(toSentenceCase(caption))}</Wrapper>
    }
  }



  const controlTheme = getElementTheme('control', props.theme);
  const className = `cb-control mx-auto mt-2 label-${labelPosition || 'top'}  ${schema.hideLabel ? 'hide-label' : ''}  ${schema.hidden ? ' opacity-60 ' : ''}  ${controlTheme.classes.join(' ')}`;

  if (labelStartEnd && isInline) {
    return (
      <Wrapper ui={schema['x-ui']} path={path} name={'control'} className={classNames(className, controlTheme.class)} style={controlTheme.style}>
        <Wrapper ui={schema['x-ui']} path={path} name={'control-input'} className={'w-full cb-control-input items-center flex gap-4'}>
          {labelPosition === 'end' && element}
          <div className='w-full'>
            {label}
            {description}
          </div>
          {labelPosition === 'start' && element}
        </Wrapper>
        {error}
      </Wrapper>
    );
  }

  if (labelStartEnd) {
    return (
      <Wrapper ui={schema['x-ui']} path={path} name={'control'} className={className}>
        <div className='flex gap-4 items-center'>
          {labelPosition === 'start' && label}
          <Wrapper ui={schema['x-ui']} path={path} name={'control-input'} className={'w-full'}>
            {element}
            {description}
          </Wrapper>
          {labelPosition === 'end' && label}
        </div>
        {error}
      </Wrapper>
    );
  }

  if (labelPosition === 'bottom') {
    return (
      <Wrapper ui={schema['x-ui']} path={path} name={'control'} className={className}>
        {element}
        {label}
        {description}
        {error}
      </Wrapper>
    );
  }

  return (
    <Wrapper ui={schema['x-ui']} path={path} name={'control'} className={className}>
      {label}
      {description}
      {element}
      {error}
    </Wrapper>
  );
};


const getElementTheme = (name, theme) => {
  if (!theme || !name) return { classes: [], style: {} };
  const elementThemeName = elementToThemeNameMap[name];
  const elementTheme = theme.controls && theme.controls[elementThemeName];
  return { classes: [], style: {}, ...(elementTheme || {}) }
}

const elementToThemeNameMap = {
  'control': 'elementWrapper',
  'input': 'input',
}