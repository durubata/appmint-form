import { BaseModelDTO, getResponseErrorMessage } from '../utils';
import * as objectPath from 'object-path';
import { isNotEmpty, classNames } from '../utils';
import React, { useState, useRef, useEffect } from 'react';
import { SelectManyList } from './select-many-list';
import { ButtonCancel } from '../common/button-cancel';
import { slimButtonClass } from '../common/constants';
import { BusyIcon } from '../common/icons/svg';
import { IconRenderer } from '../common/icons/icon-renderer';

// Stubs for missing imports from form-view/common-imports
const CollectionHelper = {
  getInstance: () => ({
    getAll: (includeData = false) => [],
    getCollectionOptions: () => [],
    getCollectionOptionsByType: (type) => [],
  })
};

const requestQueueInstance = {
  findDataByAttribute: async (collection, property, value, options) => {
    console.log(`Finding data in ${collection} where ${property}=${value}`);
    return { data: [] };
  },
  getDataById: async (datatype, id) => {
    console.log(`Getting ${id} from ${datatype}`);
    return { sk: id, datatype, data: {} };
  },
  searchData: async (collection, keyword, options) => {
    console.log(`Searching ${collection} for ${keyword}`);
    return { data: [] };
  }
};

const infoFields = ['name', 'email', 'username', 'title', 'phone'];

export const DataLookupCombo = (props: { schema; change }) => {
  const [datatype, setDatatype] = useState(props.schema?.datatype);
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<BaseModelDTO<any>>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formattedItems, setFormattedItems] = useState([]);
  const [maxItems, setMaxItems] = useState(1);
  const [minItems, setMinItems] = useState(1);

  useEffect(() => {
    setDatatype(props?.schema?.datatype);
    const maxItems = props.schema.type === 'array' ? 100 : typeof props.schema.maxItems !== 'undefined' ? props.schema.maxItems : 1;
    const minItems = typeof props.schema.minItems !== 'undefined' ? props.schema.minItems : 1;
    setMaxItems(maxItems);
    setMinItems(minItems);
  }, []);

  useEffect(() => {
    if (props.change) {
      if (props.schema && props.schema?.type !== 'array') {
        const [firstValue] = formattedItems
        props.change(firstValue);
      } else {
        props.change(formattedItems);
      }
    }
  }, [formattedItems]);

  const debouncedRef = useRef(null);

  const handleSearch = () => {
    setError(null);
    setIsLoading(true);
    requestQueueInstance
      .searchData(datatype, keyword, null)
      .then((res: any) => {
        setResult(res);
      })
      .catch(e => {
        console.error(e);
        setError(getResponseErrorMessage(e));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onKeywordChange = event => {
    setError(null);
    event.preventDefault();
    const value = event.target.value;
    setKeyword(value);
    if (value.length >= 2) {
      if (debouncedRef.current) {
        clearTimeout(debouncedRef.current);
      }
      debouncedRef.current = setTimeout(() => {
        handleSearch();
      }, 500);
    } else if (value.length === 0) {
      setResult({} as any);
      if (debouncedRef.current) {
        clearTimeout(debouncedRef.current);
      }
    }
  };

  const toggleSelection = (event, result) => {
    setError(null);
    event.preventDefault();
    const alreadySelected = selectedItems.findIndex(item => item.sk === result.sk);
    if (alreadySelected >= 0) {
      setSelectedItems(selectedItems.filter(item => item.sk !== result.sk));
      return;
    }
    if (selectedItems.length >= maxItems) {
      setError(`Maximum items allowed is ${maxItems}`);
      return;
    }
    setSelectedItems([...selectedItems, result]);

    const properties = props.schema.properties || props.schema.items.properties || props.schema.items;
    if (typeof properties === 'object') {
      const formattedItem = {};
      Object.keys(properties).forEach(key => {
        const value = objectPath.get(result, key);
        objectPath.set(formattedItem, key, value);
      });
      setFormattedItems([...formattedItems, formattedItem]);
    } else if (typeof properties === 'string') {
      const formattedItem = objectPath.get(result.data, properties);
      setFormattedItems([...formattedItems, formattedItem]);
    } else {
      setFormattedItems([...formattedItems, result]);
    }
  };

  const isSelected = id => {
    return selectedItems.findIndex(item => item.sk === id) >= 0;
  };

  const removeItem = id => {
    setError(null);
    setSelectedItems(selectedItems.filter(item => item.sk !== id));
    setFormattedItems(formattedItems.filter(item => item.sk !== id));
  };

  return (
    <div className="relative">
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      {selectedItems && (
        <div className="mb-2">
          {selectedItems?.map((item: any) => (
            <LookupItem item={item} remove={removeItem} />
          ))}
        </div>
      )}
      <div className="flex gap-1">
        <SelectManyList change={setDatatype} options={CollectionHelper.getInstance().getCollectionOptions()} schema={{ placeholder: 'Select Datatype' }} />
        <input type="text" placeholder="Enter name to search" value={keyword} onChange={onKeywordChange} className="flex-grow rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
        <button title="Search" onClick={handleSearch} className={classNames(slimButtonClass, 'flex items-center gap-2 shadow-none')}>
          <BusyIcon isLoading={isLoading} notLoadingMessage={<IconRenderer icon='FaSearch' />} />
        </button>
      </div>
      {isNotEmpty(result) && (
        <div className="bg-white rounded-lg shadow-md p-4 max-h-96 overflow-auto mt-2 absolute z-10">
          <div className='flex justify-between items-center'>
            <div className="text-sm font-semibold mb-2">{result?.total} Matching Results:</div>
            <ButtonCancel handler={() => setResult({} as any)} />
          </div>
          <ul className="space-y-2">
            {result?.data.map((result: any) => (
              <li onClick={e => toggleSelection(e, result)} key={result.sk} className={classNames(isSelected(result.sk) ? 'bg-orange-100' : 'bg-gray-50', ' p-2 rounded-md  hover:bg-cyan-100 cursor-pointer')}>
                <LookupItem item={result} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LookupItem = ({ item, remove = null }) => {
  const getTitle = () => {
    for (let field of infoFields) {
      if (item.data[field]) {
        return item.data[field];
      }
    }
  }
  return (
    <div className={classNames(remove && 'shadow px-2 py-1 rounded-lg w-full', ' text-gray-400 text-xs flex gap-4 items-center overflow-auto')}>
      {remove && (
        <button title="Remove Item" onClick={e => remove(item.sk)} className=" text-red-500">
          <IconRenderer icon="FaXmark" />
        </button>
      )}
      <div className="">
        <div className="text-[9px]">title</div>
        <div className='whitespace-nowrap text-gray-500'> {getTitle()}</div>
      </div>
      {/* <div>
        <div className="text-[9px]">id</div>
        <div className="">{item.sk}</div>
      </div> */}
      <div>
        <div className="text-[9px]">modified</div>
        <div className="whitespace-nowrap">{new Date(item.modifydate).toUTCString()}</div>
      </div>
    </div>
  );
};
