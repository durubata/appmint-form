import React from 'react';
import { ElementIcon } from './element-icon';
import { isEmpty, toSentenceCase, toTitleCase } from '../utils';
import { ElementCommonView } from './element-common-view';
import { FormPopup } from '../form-view/form-popup';
import { FormCollapsible } from '../form-view/form-collapsible';

export const ElementWrapperLayout = (props: { mode, children, path, name, schema?: { name, title, hideLabel, position, children, icon?, image?, labelPosition, iconPosition?, error?, description?, collapsible, popup, operations } }) => {
  const { path, name, schema } = props;

  if (isEmpty(schema) && isEmpty(props.children)) return null;
  if (isEmpty(schema)) return props.children;

  const iconPosition = schema.iconPosition || 'start';
  const Wrapper = ElementCommonView

  const description = schema.description ? <Wrapper ui={schema['x-ui']} path={path} name={'control-help'} className='cb-control-error text-gray-500 text-[10px]'>{schema.description}</Wrapper> : null;
  const error = schema.error ? <Wrapper ui={schema['x-ui']} path={path} name={'control-error'} className='cb-control-help text-xs text-red-400'>{schema.error}</Wrapper> : null;
  const icon = schema.icon?.length == 2 ? schema.icon : typeof schema.icon === 'string' ? <ElementIcon icon={schema?.icon} image={schema?.image} mode={props.mode} /> : null;
  let element;
  if (!schema.collapsible && icon && (iconPosition === 'start' || iconPosition === 'end')) {
    element = <Wrapper ui={schema['x-ui']} path={path} name={'input'} className='cb-input w-full flex gap-2'>{iconPosition === 'start' && icon}  {props.children} {iconPosition === 'end' && icon} </Wrapper>
  } else {
    element = <Wrapper ui={schema['x-ui']} path={path} name={'input'} className='cb-input w-full'> {props.children} </Wrapper>
  }

  let label;
  const caption = schema.title || schema.name || props.name;

  if (caption && !schema.hideLabel) {
    if (!schema.collapsible && (iconPosition === 'beforeLabel' || iconPosition === 'afterLabel')) {
      label = <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} className=' cb-label-with-icon flex gap-2 text-xs items-center'> {iconPosition === 'beforeLabel' && icon} <Wrapper path={path} name={name} className=' cb-label' >{toTitleCase(toSentenceCase(caption))}</Wrapper>{iconPosition === 'afterLabel' && icon}  </Wrapper>
    } else {
      label = <Wrapper ui={schema['x-ui']} path={path} name={'control-label'} className=' cb-label text-xs'>{toTitleCase(toSentenceCase(caption))}</Wrapper>
    }
  }


  const className = `cb-control w-full  mx-auto my-5 ${schema.labelPosition || 'top'}  ${schema.hideLabel ? 'hide-label' : ''}`;
  let render;

  if (schema.labelPosition === 'start') {
    render = (
      <>
        <Wrapper ui={schema['x-ui']} path={path} name={'control-input'} className={'cb-control-input w-full flex gap-4'}>
          {!schema.collapsible && label}
          {element}
        </Wrapper>
        <Wrapper ui={schema['x-ui']} path={path} name={'control-info'} className=' cb-control-info '>
          {description}{error}
        </Wrapper>
      </>
    );
  } else if (schema.labelPosition === 'end') {
    render = (
      <>
        <Wrapper ui={schema['x-ui']} path={path} name={'control-input'} className={'control-input w-full flex gap-4'}>
          {element}
          {!schema.collapsible && label}
        </Wrapper>
        <Wrapper ui={schema['x-ui']} path={path} name={'control-info'} className=' cb-control-info '>
          {description}{error}
        </Wrapper>
      </>
    );
  } else if (schema.labelPosition === 'bottom') {
    render = (
      <>
        {element}
        {!schema.collapsible && label}
        <Wrapper ui={schema['x-ui']} path={path} name={'control-info'} className=' cb-control-info '>
          {description}{error}
        </Wrapper>
      </>
    );
  } else {
    render = (<>
      {!schema.collapsible && label}
      {element}
      <Wrapper ui={schema['x-ui']} path={path} name={'control-info'} className=' cb-control-info '>
        {description}{error}
      </Wrapper>
    </>
    );
  }

  if (schema.collapsible) render = <FormCollapsible title={label} icon={icon}>{render}</FormCollapsible>
  if (schema.popup) return <FormPopup title={label} icon={icon}>{render}</FormPopup>
  return <Wrapper ui={schema['x-ui']} path={path} name={'control'} className={className}>{render}</Wrapper>
};
