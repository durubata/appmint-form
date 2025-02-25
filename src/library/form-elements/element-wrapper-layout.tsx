import React from 'react';
import { classNames, isEmpty, toSentenceCase, toTitleCase, ElementCommonDesign, ElementCommonView, getElementTheme, twMerge } from './common-imports';
import { FormCollapsible } from '../form-view/form-collapsible';
import { FormPopup } from '../form-view/form-popup';
import { ElementIcon } from './element-icon';

export const ElementWrapperLayout = (props: {
  mode;
  children;
  path;
  name;
  theme?;
  schema?: { name; title; hideLabel; layout?; position; children; icon?; image?; labelPosition; iconPosition?; error?; description?; collapsible; popup; operations };
  arrayControl?;
}) => {
  const { path, name, schema } = props;

  if (isEmpty(schema) && isEmpty(props.children)) return null;
  if (isEmpty(schema)) return props.children;

  const iconPosition = schema.iconPosition || 'start';
  const labelPosition = schema.labelPosition || 'top';
  const Wrapper = props.mode === 'design' ? ElementCommonDesign : ElementCommonView;

  const controlHelpTheme = getElementTheme('-help', props.theme);
  const description = schema.description ? (
    <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} name={'control-help'} className={classNames(controlHelpTheme.className, 'cb-control-error text-gray-500 text-[10px]')}>
      {schema.description}
    </Wrapper>
  ) : null;
  const error = schema.error ? (
    <Wrapper ui={schema['x-ui']} path={path} theme={props.theme} name={'control-error'} className="cb-control-help text-xs text-red-400">
      {schema.error}
    </Wrapper>
  ) : null;
  const icon = schema.icon?.length == 2 ? schema.icon : typeof schema.icon === 'string' ? <ElementIcon icon={schema?.icon} image={schema?.image} mode={props.mode} /> : null;
  let elements;
  if (!schema.collapsible && icon && (iconPosition === 'start' || iconPosition === 'end')) {
    elements = (
      <Wrapper ui={schema['x-ui']} path={path} name={'input'} theme={props.theme} className="cb-input w-full flex gap-2">
        {iconPosition === 'start' && icon} {props.children} {iconPosition === 'end' && icon}
      </Wrapper>
    );
  } else {
    elements = (
      <Wrapper ui={schema['x-ui']} path={path} name={'input'} theme={props.theme} className="cb-input w-full">
        {props.children}
      </Wrapper>
    );
  }

  const caption = schema.title ? schema.title : toSentenceCase(schema.name || props.name || '');
  let label;
  const labelTheme = getElementTheme('label', props.theme);
  if (caption && !schema.collapsible && !schema.hideLabel) {
    if ((iconPosition === 'beforeLabel' || iconPosition === 'afterLabel')) {
      label = (
        <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} theme={props.theme} className={twMerge(' cb-label-with-icon flex gap-2 text-xs items-center', labelTheme.className)}>
          {iconPosition === 'beforeLabel' && icon}
          <Wrapper path={path} name={name} theme={props.theme} className=" cb-label">
            {caption}
          </Wrapper>
          {iconPosition === 'afterLabel' && icon}
        </Wrapper>
      );
    } else {
      label = (
        <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} theme={props.theme} className={twMerge(' cb-label text-xs', labelTheme.className)}>
          {caption}
        </Wrapper>
      );
    }
  }

  let render;
  if (!schema.collapsible) {
    const hasFlex = ['start', 'end'].includes(labelPosition) || schema.layout === 'horizontal';
    render = (
      <Wrapper ui={schema['x-ui']} path={path} name={'control-input'} theme={props.theme} className={classNames(hasFlex && 'flex', 'gap-4 items-center', 'cb-control-input w-full')}>
        {!['end', 'bottom'].includes(labelPosition) && label}
        {elements}
        {['end', 'bottom'].includes(labelPosition) && label}
      </Wrapper>
    );
  }

  if (schema.collapsible)
    render = (
      <FormCollapsible defaultState={schema.collapsible} theme={props.theme} title={caption} icon={icon} arrayControl={props.arrayControl}>
        {elements}
      </FormCollapsible>
    );
  if (schema.popup)
    return (
      <FormPopup title={label} icon={icon}>
        {elements}
      </FormPopup>
    );
  const className = twMerge(`cb-layout ${labelPosition || 'top'}  ${schema.hideLabel ? 'hide-label' : ''}`);
  return (
    <Wrapper ui={schema['x-ui']} path={path} name={'layout'} className={className} theme={props.theme}>
      {render}
    </Wrapper>
  );
};
