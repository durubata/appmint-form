import { classNames, Icon, ElementCommonDesign, ElementCommonView, getElementTheme, twMerge } from './common-imports';
import React from 'react';

export const ElementIcon = (props: { icon; mode; image; className?; defaultIcon?; path?, theme?, ui?}) => {
  const { image, icon = props.defaultIcon } = props;
  const Wrapper: any = props.mode === 'design' ? ElementCommonDesign : ElementCommonView;

  const { classes: iconClasses } = (props.ui || {})['icon'] || {};
  const iconTheme = getElementTheme('control-icon', props.theme)

  const { classes: imageClasses } = (props.ui || {})['image'] || {};
  const imageTheme = getElementTheme('control-image', props.theme)

  if (image) {
    if (props.path) {
      return <Wrapper path={props.path} tag="img" src={image?.url || image} alt="" className={twMerge(classNames('control-image', props.className ? props.className : 'w-10 h-10'), imageTheme.className, imageClasses.join(' '))} />;
    } else {
      return <img src={image?.url || image} alt="" className={twMerge(classNames('control-image', props.className ? props.className : 'w-10 h-10'), imageTheme.className, imageClasses.join(' '))} />;
    }
  }
  if (icon) {
    return icon.length === 2 ? icon : <Icon name={icon} className={twMerge("control-icon", iconTheme?.className, iconClasses?.join(' '))} />;
  }
  return;
};
