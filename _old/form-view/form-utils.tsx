import * as objectPath from 'object-path';
import { getCountryDropDownOptions, getCountryRegions } from '../common/countries';
import { useFormStore } from './form-store';
import { isJsonString } from '../utils';


export const getSelectOptions = async (dataSource, data, arrayIndex?) => {
  if (!dataSource) return;

  let options;

  if (dataSource.source === 'self') {
    const key = resolveExpression(dataSource.value, arrayIndex);
    options = objectPath.get(data, key);
  } else if (dataSource.source === 'store') {
    if (dataSource.value === 'countries') {
      options = getCountryDropDownOptions();
    } else if (dataSource.value === 'country-regions') {
      let filter = dataSource.filter?.value;
      if (filter?.startsWith('{{') && filter?.endsWith('}}')) {
        const filterKey = resolveExpression(filter, arrayIndex);
        filter = objectPath.get(data, filterKey);
      }
      if (filter) {
        options = getCountryRegions(filter);
      } else {
        options = getCountryRegions('us');
      }
    } else if (dataSource.value === 'collections') {
      const collections = useFormStore.getState().collections;
      const startsWith = dataSource.filter?.value;
      if (startsWith) {
        options = collections?.filter(row => row.data.name.startsWith(startsWith)).map(row => ({ value: row.data.name, label: row.data.name, subType: row.data.subType, mainType: row.data.mainType }));
      }
      options = collections?.map(row => ({ value: row.data.name, label: row.data.name, subType: row.data.subType, mainType: row.data.mainType }));
    }
  } else if (dataSource.source === 'json') {
    options = dataSource.json || dataSource.value;
  } else if (dataSource.source === 'collection') {
    // const request = useSiteStore.getState().request
    // const response = await request(appEndpoints.find_by_attribute.name, null, `${dataSource.value}`)
    // const dataRows = response.data
    // let thisOptions = [];
    // dataRows?.forEach(row => {
    //   let values;
    //   if (!dataSource.value || dataSource.value === 'sk') {
    //     values = row[dataSource.value];
    //   } else {
    //     values = row?.data[dataSource.value];
    //   }
    //   let label
    //   if (Array.isArray(dataSource.label)) {
    //     label = dataSource.label.map(label => objectPath.get(row?.data, label)).join(' ');
    //   } else if (dataSource.label) {
    //     label = objectPath.get(row?.data, dataSource.label);
    //   } else {
    //     label = values
    //   }
    //   thisOptions.push({ label, value: values });
    // })
    // options = thisOptions
  } else if (dataSource.source === 'url') {
    // const response: any = await restAPI.request(dataSource.value)
    // options = response.data
  }

  if (isJsonString(options)) {
    options = JSON.parse(options);
  }
  return options;
}

const resolveExpression = (rawValue, arrayIndex) => {
  if (!rawValue) return rawValue;
  let parsedValue = rawValue
  if (parsedValue.startsWith('{{') && parsedValue.endsWith('}}')) {
    let valueKey: string = parsedValue.replace('{{', '').replace('}}', '');
    if (arrayIndex && valueKey.includes('[]')) {
      valueKey = valueKey.replace('[]', arrayIndex);
    }
    parsedValue = valueKey;
  }
  return parsedValue
};

export const getWatchedPaths = (dataSource, arrayIndex?) => {
  if (!dataSource) return;
  const watchedPaths = [];
  if (dataSource.source === 'self') {
    watchedPaths.push(dataSource.value);
  }
  if (dataSource.filter?.value?.startsWith('{{') && dataSource.filter?.value?.endsWith('}}')) {
    watchedPaths.push(resolveExpression(dataSource.filter?.value, arrayIndex));
  }
  return watchedPaths;
};