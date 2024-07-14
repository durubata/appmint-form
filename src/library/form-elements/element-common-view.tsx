import React, { useEffect } from 'react';
import { classNames, isNotEmpty } from '../utils';
import { dotPathToDash } from './element-helpers';
import { useElementSelector } from '../common/basic-context';

export const ElementCommonView = (props: { className?, tag?, ui?, path, name?, children?, alt?, src?}) => {
  const dashPath = dotPathToDash(props.path, props.name)

  const [element] = useElementSelector()

  useEffect(() => {

  }, [])

  const clickHandler = (e) => {
  }

  const onDoubleClick = (e) => {

  }

  const onBlur = (e) => {
  }


  let styleObj: any = {};
  if (props.ui && props.name) {
    styleObj = props.ui[props.name] || {}
  } else if (props.ui) {
    styleObj = props.ui || {}
  }
  let { classes, style, data, animation } = styleObj

  const TAG = props.tag || 'div';

  let cls = classNames(`element-common`, Array.isArray(classes) && classes.join(' '), props.className)
  if (cls.indexOf('w-') === -1) cls += ' w-full'
  cls = cls.replaceAll('element-secondary-border', '')
  cls = cls.replaceAll('element-click-border', '')
  cls = cls.replaceAll('element-hover-border', '')

  const getAttribs = () => {
    const attribs = {};
    if (isNotEmpty(data?.action)) {
      attribs['data-action'] = JSON.stringify(data?.action)
    }

    if (element.current?.id?.startsWith('slider-') && element.current?.classList?.contains('swiper') && data?.slider) {
      attribs['data-slider'] = JSON.stringify(data?.slider)
    }

    if (isNotEmpty(animation)) {
      attribs['data-animation'] = true
    }
    return attribs;
  }
  const renderTag = () => {
    if (props.children) {
      return <TAG id={dashPath} {...getAttribs()} onBlur={onBlur} onDoubleClick={onDoubleClick} ref={element} className={cls} onClick={clickHandler} style={style} >{props.children}</TAG>
    } else {
      return <TAG id={dashPath} {...getAttribs()} ref={element} className={cls} onClick={clickHandler} style={style} src={props.src} alt={props.alt} />
    }
  }
  return renderTag()
}
