import React from 'react';
import { ElementCommonView } from './element-common-view';
import { dotPathToDash } from './element-helpers';
import { toSentenceCase, toTitleCase } from '../utils';
import { ElementIcon } from './element-icon';

export const ButtonElement = (props: { path, name, mode, schema }) => {
  const { schema, path, name } = props;
  const iconPosition = schema.iconPosition || 'beforeLabel';

  const onClick = (value) => {
    console.log('handleChange', props.path)
  }

  const Wrapper = ElementCommonView

  const icon = schema.icon?.length == 2 ? schema.icon : typeof schema.icon === 'string' ? <ElementIcon icon={schema?.icon} image={schema?.image} /> : null;
  let label;
  const caption = schema.title || schema.name || props.name;
  if (caption && !schema.hideLabel) {
    if (iconPosition === 'beforeLabel' || iconPosition === 'afterLabel') {
      label = <Wrapper ui={schema['x-ui']} path={dotPathToDash(path, 'control-label')} name={name} className=' cb-label-with-icon flex gap-2 text-xs items-center'> {iconPosition === 'beforeLabel' && icon} <Wrapper path={path} name={name} className=' cb-label' >{toTitleCase(toSentenceCase(caption))}</Wrapper>{iconPosition === 'afterLabel' && icon}  </Wrapper>
    } else {
      label = <Wrapper ui={schema['x-ui']} path={dotPathToDash(path, 'control-label')} name={name} className=' cb-label text-xs'>{toTitleCase(toSentenceCase(caption))}</Wrapper>
    }
  }

  const buttonClass = "block mx-auto max-w-md my-4 items-center gap-x-2 rounded bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"

  return (
    <Wrapper ui={schema['x-ui']} tag='button' path={dotPathToDash(path, 'control')} name={name} className={buttonClass}>
      {label}
    </Wrapper>
  );
};
