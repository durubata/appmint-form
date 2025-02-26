import { validateForm } from './form-validator';
import { getFormStore } from '../context/store';
import { runFormRules } from './form-rules';
import { applyFunction } from './form-transforms';
import { DataType, getRandomString } from '../utils';
import { Transition } from '@headlessui/react';
import { getElementTheme } from '../context/store';
import { classNames } from '../utils';
import { FormLayoutRender } from './form-layout-render';
import { ElementCommonView } from '../form-elements/element-common-view';
import { FormElementRender } from '../form-elements';
import { ElementWrapperLayout } from '../form-elements/element-wrapper-layout';
import { FormRender } from './form-render';
import { FormRenderArray } from './form-render-array';
import { deepCopy } from '../utils';
import { isEmpty, isNotEmpty } from '../utils';
import * as objectPath from 'object-path';
import Ajv from 'ajv';
import { validateFormValue } from './form-validator';
import { FormPicker } from './form-picker';
import { FormCollapsible } from './form-collapsible';
import { formLayouts } from '../context/store';
import { diff } from 'deep-object-diff';

// Stubs for missing imports
const CollectionHelper = {
  getInstance: () => ({
    getAll: (includeData = false) => [],
    getCollectionOptions: () => [],
    getCollectionOptionsByType: (type) => [],
  })

};
const ContactHelper = {
  getInstance: () => ({
    getMessageRecipients: () => [],
    getAssignToOptions: () => [],
    getCustomerRecipients: () => [],
    getUserRecipients: () => [],
    getSocialMediaAccounts: () => [],
    getFromAccounts: () => []
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
import { validateValue } from './form-validator';
import { localStorageUtils } from '../utils/localstorage';
import { Popover } from '../common/popover';
import { tabButtonActiveClass, tabButtonClass } from '../common/constants';
import { DataPicker } from '../common/data-picker';
import { ButtonAdd } from '../common/button-add';
import { ButtonDelete } from '../common/button-delete';
import { LoadingIndicator } from '../common/loading-indicator';
// Export all individual imports without combining names from the same path
export {
  validateForm,
  getFormStore,
  runFormRules,
  applyFunction,
  DataType,
  Transition,
  getElementTheme,
  classNames,
  localStorageUtils,
  FormLayoutRender,
  ElementCommonView,
  formLayouts,
  FormElementRender,
  ElementWrapperLayout,
  FormRender,
  FormRenderArray,
  deepCopy,
  isEmpty,
  isNotEmpty,
  tabButtonActiveClass,
  tabButtonClass,
  DataPicker,
  Popover,
  ButtonAdd,
  diff,
  ButtonDelete,
  LoadingIndicator,
  objectPath,
  Ajv,
  validateFormValue,
  getRandomString,
  FormPicker,
  FormCollapsible,
  CollectionHelper,
  ContactHelper,
  requestQueueInstance,
  validateValue,
};
