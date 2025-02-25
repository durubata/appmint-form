import { useStyleMintStore } from 'components/property/style-mint/style-store';
import React, { useEffect, useState } from 'react';
import { eventEmitterTypes, eventEmitterHelper } from 'utils/event-emitter-helper';
import { useElementSelector } from 'components/common/basic-element/basic-element-selector';
import { classNames } from '../utils';
import { dotPathToDash } from './element-helpers';
import { useCollectionStore } from '../collection-store';
import { handleDynamicEvent } from 'components/property/style-mint/style-action-utils';
import { useShallow } from 'zustand/react/shallow';

export const ElementCommonDesign = (props: { use?; className?; tag?; ui?; path; name?; children?; src?; alt?; onClick?}) => {
  const dashPath = dotPathToDash(props?.path, props?.name);
  let tempPath = !props.path ? `x-ui` : `${props.path}.x-ui`;
  const dataPath = props.name ? `${tempPath}.${props.name}` : tempPath;
  const { setStateItem, deleteProp, timestamp, getPropsItem, setPropsItem, actionPreview, target, getStateItem, selectionHelper, extTargets, toggleExtTarget } = useStyleMintStore(useShallow(state => ({ setStateItem: state.setStateItem, deleteProp: state.deleteProp, timestamp: state.timestamp, getPropsItem: state.getPropsItem, setPropsItem: state.setPropsItem, actionPreview: state.actionPreview, target: state.target, getStateItem: state.getStateItem, selectionHelper: state.selectionHelper, extTargets: state.extTargets, toggleExtTarget: state.toggleExtTarget })));

  const [element] = useElementSelector();
  const [editable, setEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      addMouseEvent();
      setIsLoading(false);
    }, 1000);

    return () => {
      deleteProp(dashPath, null);
    };
  }, []);

  useEffect(() => {
    let styleObj: any = {};
    if (props.ui && props.name) {
      styleObj = props.ui[props.name] || {};
    } else if (props.ui) {
      styleObj = props.ui || {};
    }
    let { classes, style, data, animation } = styleObj;
    classes = classes || props.className?.split(' ');
    setPropsItem(dashPath, { classes, data, style, animation, meta: null, setting: null }, false);
  }, [dashPath, props.tag]);

  useEffect(() => {
    addMouseEvent();
  }, [dashPath, element.current]);

  useEffect(() => {
    if (target === dashPath) {
      const uData = getPropsItem(dashPath) || {};
      useCollectionStore.getState().updateSchemaItem(dataPath, uData, true);
      console.debug(dataPath, uData);
    }
  }, [timestamp]);

  const addMouseEvent = () => {
    if (element.current) {
      element.current.addEventListener('mouseover', function (e) {
        element.current.classList.add('element-hover-border');
        e.stopPropagation();
      });

      element.current.addEventListener('mouseout', function (e) {
        element.current.classList.remove('element-hover-border');
        e.stopPropagation();
      });
    }
  };

  const clickHandler = e => {
    e.stopPropagation();
    e.preventDefault();

    if (e.shiftKey || getStateItem('groupSelection')) {
      toggleExtTarget(dashPath);
      return;
    }

    const otherSecondary = document.querySelectorAll('.element-secondary-border');
    otherSecondary.forEach(element => {
      element.classList.remove('element-secondary-border');
    });

    let otherElement = document.querySelectorAll('.element-click-border');
    otherElement.forEach(element => {
      element.classList.remove('element-click-border');
    });

    otherElement = document.querySelectorAll('.element-click-border');
    otherElement.forEach(element => {
      element.classList.remove('element-click-border');
    });

    if (!element.current) return;
    if (element.current.classList?.contains('element-hover-border')) {
    } else {
      addMouseEvent();
    }

    element.current.classList.add('element-click-border');
    setStateItem({ extTargets: [], tag: props.tag || 'div', target: dashPath });
    eventEmitterHelper.emit(eventEmitterTypes.collection_builder_element_clicked, `${props.tag}:${dashPath}`);

    if (actionPreview) {
      handleDynamicEvent(e);
    }

    if (props.onClick) {
      props.onClick(e);
    }
    console.log('clickHandler', props.path);
    useCollectionStore.getState().setStateItem({ activePath: props.path });
  };

  const onDoubleClick = e => {
    e.stopPropagation();
    e.preventDefault();
    setEditMode(true);
  };

  const onBlur = e => {
    e.stopPropagation();
    e.preventDefault();
    setEditMode(false);
  };

  if (!dashPath) return;

  const { classes, style } = getPropsItem(dashPath) || {};

  const isActive = target === dashPath;

  let cls = classNames(`element-common p-1`, isActive && 'element-click-border', extTargets?.includes(dashPath) && 'element-secondary-border', selectionHelper && 'selection-helper', Array.isArray(classes) && classes.join(' '));
  if (!extTargets?.includes(dashPath)) {
    cls = cls.replaceAll('element-secondary-border', '');
  }


  const elementProps = {
    'data-path': props.path,
    'data-use': props.use,
    onBlur: onBlur,
    onDoubleClick: onDoubleClick,
    contentEditable: editMode,
    ref: element,
    className: cls,
    onClick: clickHandler,
    style: style,
    'data-type': 'editable'
  };
  return React.createElement(props.tag || 'div', elementProps, props.children);
};
