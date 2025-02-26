import React, { useState, useEffect } from 'react';
import { CollectionHelper, requestQueueInstance } from '../form-view/common-imports';
import { BaseModel, BaseModelDTO, DataType, getResponseErrorMessage, isNotEmpty } from '../utils';
import { PageSort, sortTreeItem } from './page-sort';
import { iconButtonClass } from './constants';
import { Icon } from '../form-elements/common-imports';
import BusyIcon from './icons/svg';
import { LoadingIndicator } from './loading-indicator';
import { FloatBox } from './float-box';

export interface DataPickerType {
  collectionName: string;
  showHide: boolean;
  title?: string;
  maxItems?: number;
  minItems?: number;
  selected?: any[];
  rowData?: any[];
}


export function DataPicker(props: { dataPickerState?: DataPickerType; closeButton?; selectButton?; selectedIds?}) {
  const { dataPickerState } = props;
  const [selected, setSelected] = useState<BaseModel<any>[]>();
  const [dataRow, setDataRow] = useState<any[]>();
  const [dataDTO, setDataDTO] = useState<any>();
  const [collectionName, setCollectionName] = useState(props.dataPickerState?.collectionName);
  const [filter, setFilter] = React.useState('');
  const [sort, setSort] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const collectionOptions = CollectionHelper.getInstance().getCollectionOptions();

  useEffect(() => {

  }, [collectionOptions]);


  useEffect(() => {
    setDataRow([]);
    if (collectionName) {
      loadNextPage();
    }
  }, [collectionName]);

  useEffect(() => {
    if (isNotEmpty(dataPickerState?.rowData)) {
      setDataRow(dataPickerState.rowData);
    } else {
      loadNextPage(true);
    }
  }, [props.dataPickerState]);

  const loadNextPage = async (refresh = false) => {
    refresh = typeof refresh === 'boolean' ? refresh : false;
    setError(null);
    setIsLoading(true);
    const nextPage = refresh ? 1 : (dataDTO?.page || 1) + 1;
    await requestQueueInstance
      .searchData(props.dataPickerState?.collectionName, filter, { page: nextPage, refresh })
      .then((res: any) => {
        const dataRow = [];
        res.data.forEach((row, i) => {
          const rowItem = {
            id: row.sk,
            categories: Array.isArray(row.post?.categories) ? row.post?.categories.join(',') : row.post?.categories,
            tags: Array.isArray(row.post?.tags) ? row.post?.tags.join(',') : row.post?.tags,
            datatype: row.datatype,
            createdate: row.createdate,
            modifydate: row.modifydate,
            author: row.author,
            ...row.data,
          };
          delete rowItem.data;
          delete rowItem.requiredRole;
          delete rowItem.post;
          delete rowItem.style;
          delete rowItem.search;
          delete rowItem._id;
          delete rowItem.sk;
          delete rowItem.data;
          if (res.datatype === 'post') {
            delete rowItem.content;
          }
          dataRow.push(rowItem);
        });
        setDataDTO(res);
        setDataRow(dataRow);
      })
      .catch(err => {
        setError(getResponseErrorMessage(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const toggleRowSelect = (selectedIds: string[]) => {
    if (!selectedIds) return;
    const newSelected = dataRow.filter(item => selectedIds.includes(item.id));
    setSelected(newSelected);
  };

  const selectButton = () => {
    props.selectButton(selected);
  };

  const closeButton = () => {
    props.closeButton();
  };

  const changeSortType = sortItem => {
    setSort(sortItem.value);
  };

  if (!dataPickerState || !dataPickerState.showHide) {
    return <></>;
  }

  let items =
    filter.length > 2
      ? dataRow?.filter(item => {
        const itemString = JSON.stringify(item).toLowerCase();
        return itemString.includes(filter.toLowerCase());
      })
      : dataRow;

  if (sort) {
    items = sortTreeItem(items, sort);
  }


  return (
    <FloatBox key="datapicker" name="datapicker" title={dataPickerState.title} close={e => props.closeButton()}>
      <div>
        <div className="py-3 px-5 mb-4">
          <div className="flex gap-4 w-full items-center">
            <div className="p-2  border border-gray-300 flex items-center rounded-xl w-full">
              <Icon name="FaSearch" />
              <input name="search" className="w-full text-sm p-1 border-none mx-2  focus:ring-0 focus-within:ring-0 focus-visible:ring-0 " value={filter} onChange={e => setFilter(e.target.value)} />
            </div>
            <PageSort sortValue={sort} onChange={changeSortType} />
            <button onClick={() => loadNextPage(true)} className={iconButtonClass}>
              <BusyIcon isLoading={isLoading} /> <Icon name="IoRefresh" />{' '}
            </button>
          </div>
        </div>
        <div className="shadow mb-2 border-l-8 border-yellow-400 border-solid absolute top-1 right-40 w-96">
          <select className="highlight-select w-full px-4 py-2 border-0" onChange={e => setCollectionName(e.target.value)}>
            <option value="">Select a collection</option>
            {collectionOptions?.map((item: any) => (
              <option key={item.value} value={item.mainType} selected={item.mainType === collectionName}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isLoading && <LoadingIndicator />}
      {error && <div className=" max-w-screen-md mx-auto bg-red-100 p-2 text-sm text-center">{error}</div>}
      {items && (
        <div className="p-2 pb-24 h-[calc(100%-100px)]">
          {/* <CustomTable data={items} columns={null} toggleRowSelect={toggleRowSelect} selected={props.selectedIds} /> */}
        </div>
      )}
      <div className="float-window-footer w-full flex items-center !justify-center bg-white border-t border-t-gray-300">
        {dataDTO?.hasNext && (
          <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => loadNextPage()} className={iconButtonClass}>
              <BusyIcon isLoading={isLoading} /> <span className="p-2">Load more</span>
            </button>
          </div>
        )}
        <button className="button-cancel" title="Cancel" onClick={closeButton}>
          <Icon name='FaXmark' size={20} />
        </button>
        <button className="button-accept" title="Accept" onClick={selectButton}>
          <Icon name='FaCheck' size={20} />
        </button>
      </div>
    </FloatBox>
  );
}
