import { isNotEmpty, dotPathToDash, twMerge, getElementTheme } from './common-imports';
import React, { useEffect } from 'react';

export const ElementCommonView = (props: { id?; readOnly?; disabled?; className?; tag?; ui?; path; theme?; name?; children?; alt?; src?; onClick?}) => {
  let dashPath = '';
  if (!dotPathToDash) {
    console.error('dotPathToDash is not defined', { id: props.id, path: props.path, name: props.name });
    throw new Error('dotPathToDash is not defined');
  } else {
    dashPath = dotPathToDash(props?.path, props?.name);
  }

  useEffect(() => { }, []);

  const clickHandler = e => {
    if (props.onClick) {
      props.onClick(e);
    }
  };

  const onDoubleClick = e => { };

  const onBlur = e => { };

  let styleObj: any = {};
  if (props.ui && props.name) {
    styleObj = props.ui[props.name] || {};
  } else if (props.ui) {
    styleObj = props.ui || {};
  }
  const theme = getElementTheme(props.name, props.theme)

  let { classes, style } = styleObj;

  let cls = twMerge(` w-full element-common`, props.className, theme?.className, Array.isArray(classes) && classes.join(' '));
  cls = cls.replaceAll('element-secondary-border', '');
  cls = cls.replaceAll('element-click-border', '');
  cls = cls.replaceAll('element-hover-border', '');

  const elementProps = {
    'data-ui-name': props.name,
    readOnly: props.readOnly,
    id: props.id || dashPath,
    className: cls,
    onClick: clickHandler,
    onBlur: onBlur,
    onDoubleClick: onDoubleClick,
    style: style,
    disabled: props.disabled
  };

  return React.createElement(props.tag || 'div', elementProps, props.children);
};
