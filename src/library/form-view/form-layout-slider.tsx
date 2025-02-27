import { FormLayoutRender } from './form-layout-render';
import { classNames } from '../utils';
import { isNotEmpty } from '../utils';
import { useFormStore } from '../context/store';
import { validateFormValue } from './form-validator';
import { ElementCommonView } from '../form-elements/element-common-view';
import React, { useEffect } from 'react';
import FormLayoutSliderAnimation from './form-layout-slider-animation';
import { shallow, useShallow } from 'zustand/shallow';
import { IconRenderer } from '../common/icons/icon-renderer';

export const FormLayoutSlider = ({ storeId, layoutPath, path, dataPath, schema }) => {
  const { getSchemaItem, getError, getItemValue, updateError, timestamp } = useFormStore(useShallow(state => ({
    getSchemaItem: state.getSchemaItem,
    getError: state.getError,
    getItemValue: state.getItemValue,
    updateError: state.updateError,
    timestamp: state.timestamp
  })));
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [error, setError] = React.useState(null);

  const layoutTimestamp = timestamp[layoutPath];
  useEffect(() => {
    const data = getItemValue(dataPath);
    setError(null);
    if (!hasError(false) && schema.autoProgress) {
      setTimeout(() => {
        doAutoProgress();
      }, 2000);
    }
  }, [layoutTimestamp]);

  const doAutoProgress = () => {
    if (hasError()) return;
    let newMode = slideIndex + 1;
    if (newMode >= layout?.items?.length) newMode = 0;
    setSlideIndex(newMode);
  };

  const makeActiveSlide = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    if (hasError()) return;
    setSlideIndex(idx);
  };

  const skipPrev = e => {
    e.stopPropagation();
    e.preventDefault();
    let newMode = slideIndex - 1;
    if (newMode < 0) newMode = 0;
    setSlideIndex(newMode);
  };

  const skipNext = e => {
    e.stopPropagation();
    e.preventDefault();
    if (hasError()) return;

    let newMode = slideIndex + 1;
    if (newMode >= layout?.items?.length) newMode = layout?.items?.length - 1;
    setSlideIndex(newMode);
  };

  const hasError = (saveError = true) => {
    // const slideError = getError(dataPath, true)
    // if (isNotEmpty(slideError)) {
    //   setError(slideError)
    //   console.error('Slide Error', slideError)
    //   return true;
    // } else {
    const itemPath = layoutPath + '.items.' + slideIndex;
    const properties = getSchemaItem(path);
    let errors = Object.keys(properties).map(fieldName => {
      const fieldPath = path + '.' + fieldName;
      const { layoutGroup } = properties[fieldName] || {};
      if (layoutGroup !== itemPath) return null;
      const fieldSchema = getSchemaItem(fieldPath);
      const valuePath = dataPath ? dataPath + '.' + fieldName : fieldName;
      const value = getItemValue(valuePath);
      const data = dataPath ? getItemValue('') : {};
      const validationResult = validateFormValue(dataPath, value, fieldSchema, data);
      if (isNotEmpty(validationResult.errors)) {
        if (saveError) updateError(valuePath, validationResult.message);
        return validationResult.message;
      } else {
        if (saveError) updateError(valuePath, null);
        return null;
      }
    });
    errors = errors.filter(isNotEmpty);
    if (errors.length > 0) {
      if (saveError) setError(errors.join(', '));
      console.error('Form Error', errors);
      return true;
    } else {
      if (saveError) setError(null);
      return false;
    }
  };

  const layout = getSchemaItem(layoutPath);

  const getView = viewIndex => {
    if (viewIndex < 0) {
      return <div className="text-center p-10">Slider Mode</div>;
    }
    const slide = layout?.items?.[viewIndex];
    const itemPath = layoutPath + '.items.' + viewIndex;
    const itemLayout = getSchemaItem(itemPath);

    if (schema.autoProgress) {
      const properties = getSchemaItem(path);
      const allPaths = Object.keys(properties).map(fieldName => dataPath + '.' + fieldName);
      useFormStore.getState().updateWatchedPath(layoutPath, allPaths);
    }

    return (
      <div className={classNames(error && 'animate__animated animate__headShake', ' gap-1 items-center justify-star w-full')}>
        {itemLayout ? <FormLayoutRender path={path} layoutPath={itemPath} dataPath={dataPath} storeId={storeId} /> : <div className="text-xs w-full text-center text-red-400">empty layout</div>}
      </div>
    );
  };

  return (
    <div className=" w-full">
      {error && <div className="text-xs w-full text-center text-red-400">{error}</div>}
      {/* {getView(slideIndex)} */}
      <ElementCommonView path={layoutPath} name={null} ui={layout['x-ui']} className={''}>
        <FormLayoutSliderAnimation direction="horizontal" items={layout?.items} getView={getView} slideIndex={slideIndex} />
      </ElementCommonView>
      <div className="text-xs flex flex-wrap gap-2 w-full mt-2 px-2">
        <button title="Slide" onClick={e => makeActiveSlide(e, -1)} className={classNames(slideIndex < 0 && 'bg-yellow-200', ' h-5 w-5 flex items-center justify-center  border-cyan-400 border rounded p-0 hover:bg-cyan-300')}>
          <IconRenderer icon="GrPlay" />
        </button>
        <button title="Previous" onClick={skipPrev} className={classNames(' h-5 w-5 flex items-center justify-center  border-cyan-400 border rounded p-0 hover:bg-cyan-300')}>
          <IconRenderer icon="PiSkipBack" />
        </button>
        <button title="Next" onClick={skipNext} className={classNames(' h-5 w-5 flex items-center justify-center  border-cyan-400 border rounded p-0 hover:bg-cyan-300')}>
          <IconRenderer icon="PiSkipForward" />
        </button>
        {layout?.items?.map((_, idx) => (
          <button
            title={'Slide ' + 1}
            onClick={e => makeActiveSlide(e, idx)}
            className={classNames(slideIndex === idx && 'bg-yellow-200', ' h-5 w-5 flex items-center justify-center border-cyan-400 border rounded p-0 text-[11px] hover:bg-cyan-300')}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
