import { classNames } from '../utils';
import { Icon } from '../common/icons/list';
import React from 'react';
import { ElementCommonView } from './element-common-view';

export const ElementIcon = (props: { icon, mode, image, className?, defaultIcon?, path?}) => {

  const { image, icon = props.defaultIcon } = props
  const Wrapper: any = props.mode === ElementCommonView


  if (image) {
    if (props.path) {
      return <Wrapper path={props.path} tag='img' src={image?.url || image} alt='' className={classNames('cb-label-image', props.className ? props.className : 'w-10 h-10')} />;
    } else {
      return <img src={image?.url || image} alt='' className={classNames('cb-label-image', props.className ? props.className : 'w-10 h-10')} />;
    }
  }
  if (icon) {
    return icon.length === 2 ? icon : <Icon name={icon} className='cb-label-icon' />;
  }
  return;
};
