import { classNames, isEmpty, toSentenceCase, toTitleCase, ElementCommonDesign, ElementCommonView, elementStyleClassMap, getElementTheme } from './common-imports';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ElementIcon } from './element-icon';

const fixedLabel = ['checkbox', 'radio', 'switch', 'button', 'color', 'icon-button', 'date', 'date-time', 'date-range', 'lookup'];

export const ElementWrapperControl = (props: {
  mode;
  children;
  controlType;
  activeDataPath;
  isActive;
  hasValue;
  path;
  error?;
  name;
  theme?;
  schema?: { validations; hidden; name; title; hideLabel; position; children; image?; icon?; labelPosition; iconPosition?; error?; description };
}) => {
  const { path, name, schema, controlType, isActive, hasValue, activeDataPath } = props;
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const errorMsg = props.error || schema.error;
    setErrorMsg(errorMsg);
  }, [path, props.error]);

  if (isEmpty(schema) && isEmpty(props.children)) return null;
  if (isEmpty(schema)) return props.children;

  const iconPosition = schema.iconPosition || '';
  let labelPosition = schema.labelPosition || 'auto';
  if (labelPosition === 'auto' && props.mode === 'design') {
    labelPosition = 'top';
  }
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

  const isFixedLabel = fixedLabel.includes(controlType);
  const defaultClass = elementStyleClassMap[controlType] || 'my-1 ';
  const controlHelpTheme = getElementTheme('help', props.theme);

  const description =
    schema.description || info ? (
      <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} name={'control-help'} className={classNames(controlHelpTheme.className, iconStarEnd && labelStartEnd && schema.icon && !isInline && 'ml-8', 'cb-control-error text-gray-500 text-[10px]')}>
        {schema.description || ''} {info}
      </Wrapper>
    ) : null;
  const error = errorMsg ? (
    <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} name={'control-error'} className="cb-control-help text-xs text-red-400">
      {errorMsg}
    </Wrapper>
  ) : null;
  const icon = schema.icon?.length == 2 ? schema.icon : typeof schema.icon === 'string' ? <ElementIcon ui={schema['x-ui']} icon={schema?.icon} image={schema?.image} mode={props.mode} theme={props.theme} /> : null;
  let element;
  const controlThemeStyle = getElementTheme('control-' + controlType, props.theme);
  const inputClasses = classNames(isInline ? 'w-fit' : 'w-full', ['start', 'end'].includes(iconPosition) && 'my-1 flex gap-2 items-center', defaultClass, controlThemeStyle?.className);
  if (icon && (iconPosition === 'start' || iconPosition === 'end')) {
    element = (
      <Wrapper ui={schema['x-ui']} theme={props.theme} path={path} name={'control-input'} className={twMerge(inputClasses)}>
        {iconPosition === 'start' && icon} {props.children} {iconPosition === 'end' && icon}
      </Wrapper>
    );
  } else {
    element = (
      <Wrapper ui={schema['x-ui']} theme={props.theme} path={path} name={'control-input'} className={twMerge(inputClasses)}>
        {props.children}
      </Wrapper>
    );
  }

  let label;
  const controlHelpLabel = getElementTheme('label', props.theme);
  const caption = schema.title ? schema.title : toSentenceCase(schema.name || props.name || '');

  if (caption && !schema.hideLabel) {
    if (iconPosition === 'beforeLabel' || iconPosition === 'afterLabel') {
      label = (
        <Wrapper ui={schema['x-ui']} theme={props.theme} path={path} name={'control-label'} className={twMerge(classNames(controlHelpLabel.className, labelStartEnd && !isInline && '-mt-5', 'cb-label-with-icon flex gap-2 text-xs items-center'))}>
          {iconPosition === 'beforeLabel' && icon}
          <Wrapper path={path} theme={props.theme} name={"control-label-inner"} className="control-label-inner">
            {caption}
          </Wrapper>
          {iconPosition === 'afterLabel' && icon}
        </Wrapper>
      );
    } else {
      label = (
        <Wrapper
          ui={schema['x-ui']}
          path={path}
          theme={props.theme}
          name={'control-label'}
          className={twMerge(
            classNames(
              controlHelpLabel.className,
              labelPosition === 'auto' && !isFixedLabel && !hasValue && 'opacity-0',
              labelPosition === 'auto' && hasValue && '!text-[8px]  opacity-100',
              labelStartEnd && !isInline && '-mt-5',
              'cb-label text-xs',
              ' transition-all duration-200',
            ),
          )}
        >
          {caption}
        </Wrapper>
      );
    }
  }

  const className = `cb-control label-${labelPosition}  ${schema.hideLabel ? 'hide-label' : ''}  ${schema.hidden ? ' opacity-60 ' : ''} `;

  if (labelStartEnd && isInline) {
    return (
      <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} use={controlType} name={'control'} className={twMerge(className, 'relative')}>
        <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} name={'control-inner'} className={'w-full cb-control-input items-center flex gap-4'}>
          {labelPosition === 'end' && element}
          <div className="w-full">
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
      <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} use={controlType} name={'control'} className={twMerge(className, 'relative')}>
        <div className="flex gap-4 items-center">
          {labelPosition === 'start' && label}
          <Wrapper ui={schema['x-ui']} theme={props.theme} path={path} name={'control-inner'} className={'w-full'}>
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
      <Wrapper ui={schema['x-ui']} theme={props.theme} path={path} use={controlType} name={'control'} className={twMerge(className, 'relative')} >
        {element}
        {label}
        {description}
        {error}
      </Wrapper>
    );
  }
  return (
    <Wrapper ui={schema['x-ui']} theme={props.theme} path={path} use={controlType} name={'control'} className={twMerge(className, 'relative')} >
      {label}
      {element}
      {description}
      {error}
    </Wrapper>
  );
};
