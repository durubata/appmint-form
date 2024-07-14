import React, { useEffect, useState } from 'react';
import { useFormStore } from './form-store';
import { validateFormValue } from './form-validator';
import { classNames, isNotEmpty } from '../utils';
// import { DataPicker } from 'components/data-view/data-picker';
import { applyFunction } from './form-transforms';
import { Icon } from '../common/icons/list';

export const FormPicker = (props: { dataPath, schema }) => {
  const { dataPath, schema } = props;
  const { setItemValue, updateError, getItemValue, getDefaultValue } = useFormStore(state => state, (ov, nv) => { return ov.schema === nv.schema });
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [pendingConfirm, setPendingConfirm] = React.useState(false);
  const [dataPickerProp, setDataPickerProps] = useState(null);
  const [collectionName, setCollectionName] = useState();
  const [sourceData, setSourceData] = useState<any[]>();

  useEffect(() => {
    const value = getItemValue(dataPath);
    if (value) {
      const localSelected = schema.type === 'object' ? [value] : value;
      setSelectedItems(localSelected);
    }

    if (schema.dataSource?.source === 'collection') {
      setCollectionName(schema.dataSource.value);
    }
    // if (schema.dataSource?.source === 'url') {
    //   (async () => {
    //     const newDataRow = await restAPI.getDataFromUrl(schema.dataSource.url);
    //     setSourceData(newDataRow);
    //   })();
    // } else if (schema.dataSource?.source === 'json') {
    //   if (typeof schema.dataSource.json === 'string') {
    //     setSourceData(JSON.parse(schema.dataSource.json));
    //   } else {
    //     setSourceData(schema.dataSource.json);
    //   }
    // }
  }, []);


  const clearAll = () => {
    if (pendingConfirm) {
      console.log('clearAll button');
      setPendingConfirm(false);
      return;
    } else {
      setPendingConfirm(true);
      setTimeout(() => {
        setPendingConfirm(false);
      }, 3000);
    }
  }

  const pickData = () => {
    const maxItems = schema.type === 'object' ? 1 : schema.maxItems;
    setDataPickerProps({
      showHide: true,
      title: ``,
      collectionName: collectionName,
      minItems: schema.minItems,
      maxItems: maxItems,
      selected: selectedItems,
      rowData: sourceData,
    });
  };


  const updateSelected = selectedItems => {
    updateError(dataPath, null)
    if (schema.maxItems > 0 && selectedItems && selectedItems.length > schema.maxItems) {
      const tooManItemsError: any = {
        message: `Too many items selected, you can select a maximum of ${schema.maxItems}`,
      };
      updateError(dataPath, tooManItemsError);
      const message: string = Object.values(tooManItemsError)
        .map((temp: string) => temp)
        .join(' ');
      // notificationStore.addNotification({
      //   message,
      //   type: 'error',
      // });
      console.log(tooManItemsError);
      return;
    }

    let newSelected;
    let fieldProps;
    if (schema.type === 'object') {
      fieldProps = schema.properties;
      newSelected = { id: selectedItems[0].id };
      Object.keys(schema.properties).forEach(key => {
        newSelected[key] = selectedItems[0][key];
      });
    } else if (schema.type === 'array') {
      fieldProps = schema.items.properties;
      newSelected = [];
      if (schema.items.type === 'object') {
        selectedItems.forEach(selRow => {
          const thisRow = { id: selRow.id };
          newSelected.push(thisRow);
          Object.keys(schema.items.properties).forEach(key => {
            thisRow[key] = selRow[key];
          });
        });
      }
    } else {
      // notificationStore.addNotification({
      //   message: `Invalid picker schema definition ${schema}`,
      //   type: 'error',
      //   title: ' Data Picker Error',
      // });
      console.log(`Invalid picker schema definition ${schema}`);
      return;
    }

    //remove all empty values;
    newSelected.forEach((item, rowIndex) => {
      Object.keys(item).forEach(key => {
        item[key] = item[key] || getDefaultValue(key, fieldProps[key], null, item)
        if (fieldProps[key] && fieldProps[key].fn) {
          const fnResult = applyFunction(fieldProps[key].fn, item[key], item, null);
          if (fnResult.status === 'success') {
            item[key] = fnResult.value;
          } else {
            updateError(`${dataPath}.${rowIndex}.${key}`, fnResult.message)
          }
        }
        if (item[key] === '') {
          delete item[key];
        }
      });
    });
    const validationResult = validateFormValue(dataPath, newSelected, schema, getItemValue(''))
    if (isNotEmpty(validationResult.errors)) {
      updateError(dataPath, validationResult.message)
      console.log(validationResult.message);
    } else {
      updateError(dataPath, null)
      setSelectedItems(newSelected);
      const localSelected = schema.type === 'object' ? [newSelected] : newSelected;
      setItemValue(dataPath, localSelected);
    }
  };

  const closeButton = () => {
    setDataPickerProps(null);
  };

  const selectButton = selectedItems => {
    console.log('selectedItems', selectedItems);
    updateSelected(selectedItems);
    setDataPickerProps(null);
  };

  return (
    <div className=" flex justify-end gap-2 p-2 mx-auto w-fit">
      {/* {dataPickerProp && <DataPicker dataPickerState={dataPickerProp} closeButton={closeButton} selectButton={selectButton} selectedIds={selectedItems?.map(item => item.id)} />} */}
      <button title='Confirm' type='button' onClick={clearAll} className={classNames(pendingConfirm ? 'bg-red-400' : '', 'button-remove shadow-[2px_1px_5px_1px_#ccc] m-2 rounded-lg p-2 hover:scale-125 duration-200 transition-all hover:bg-red-200')}>
        <Icon name={pendingConfirm ? 'FaCheck' : 'FaTrash'} size={12} />
      </button>
      <button title='Add' type='button' className='button-add shadow-[2px_1px_5px_1px_#ccc] m-2 rounded-lg p-2 hover:scale-125 duration-200 transition-all hover:bg-cyan-200' onClick={pickData}>
        <Icon name='FaPlus' size={12} />
      </button>
    </div>
  );
};
