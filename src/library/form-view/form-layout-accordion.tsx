import { shallow } from 'zustand/shallow';
import { classNames } from '../utils';
import { FormLayoutRender } from './form-layout-render';
import { getFormStore } from '../context/store';
import { ElementCommonView } from '../form-elements/element-common-view';
import React from 'react';
export const FormLayoutAccordion = ({ storeId, layoutPath, path, dataPath }) => {
  const { getSchemaItem } = getFormStore(storeId)(state => ({ getSchemaItem: state.getSchemaItem }));
  const [accordionState, setAccordionState] = React.useState([]);

  const toggleAccordion = itemPath => {
    if (accordionState.includes(itemPath)) {
      setAccordionState(accordionState.filter(path => path !== itemPath));
    } else {
      setAccordionState([...accordionState, itemPath]);
    }
  };

  const layout = getSchemaItem(layoutPath);
  return (
    <ElementCommonView path={layoutPath} name={null} ui={layout['x-ui']} className={' w-full'}>
      {layout?.items?.map((item, idx) => {
        const itemPath = layoutPath + '.items.' + idx;
        const itemLayout = getSchemaItem(itemPath);
        return (
          <div className="mb-px">
            <div
              key={item.id}
              className={classNames('px-4 py-2 mb-px items-center border border-gray-100  flex justify-between bg-white gap-4 text-xs shadow cursor-pointer hover:bg-cyan-50', accordionState.includes(itemPath) ? 'bg-cyan-100' : '')}
              onClick={e => toggleAccordion(itemPath)}
            >
              {item.title}
            </div>
            {accordionState.includes(itemPath) && (
              <>{itemLayout ? <FormLayoutRender path={path} layoutPath={itemPath} dataPath={dataPath} storeId={storeId} /> : <div className="text-xs w-full text-center text-red-400">empty layout</div>}</>
            )}
          </div>
        );
      })}
    </ElementCommonView>
  );
};
