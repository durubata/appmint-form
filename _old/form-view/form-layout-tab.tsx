import React from 'react';
import { classNames } from '../utils';
import { FormLayoutRender } from './form-layout-render';
import { useFormStore } from './form-store';
import { ElementCommonView } from '../form-elements/element-common-view';

export const FormLayoutTab = ({ layoutPath, path, dataPath }) => {
  const shouldReload = (ov, nv) => {
    return true;
  }
  const { getSchemaItem } = useFormStore(state => state, shouldReload)
  const [value, setValue] = React.useState(layoutPath + '.items.0');

  const layout = getSchemaItem(layoutPath);
  const activeLayout = getSchemaItem(value);
  return (
    <div className=' w-full '>
      <div className='flex gap-1 items-center justify-start bg-gray-100 p-2'>
        {layout?.items?.map((item, idx) => {
          const itemPath = layoutPath + '.items.' + idx;
          return (
            <div key={item.id} className={classNames('px-4 py-2  items-center flex justify-between bg-white gap-4 text-xs cursor-pointer hover:bg-cyan-50', value === itemPath ? 'bg-yellow-100' : '')} onClick={e => setValue(itemPath)}>
              {item.title}
            </div>
          )
        })}
      </div>
      <ElementCommonView path={layoutPath} name={null} ui={layout['x-ui']} className={''}>
        {(value && activeLayout) ? (
          <FormLayoutRender path={path} layoutPath={value} dataPath={dataPath} />
        ) : <div className='text-xs w-full text-center text-red-400'>empty layout</div>}
      </ElementCommonView>
    </div>
  );
};
