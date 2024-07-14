import { create } from 'zustand';
import * as objectPath from 'object-path';
import { FormLayoutAccordion } from './form-layout-accordion';
import { FormLayoutTab } from './form-layout-tab';
import { FormLayoutSlider } from './form-layout-slider';
import { produce } from 'immer';
import { getTemplateValue } from './form-validator';
import { deepCopy, isNotEmpty } from '../utils';

export const accessModes = { 'full': 1, 'read': 2, 'create': 3, 'update': 4, 'delete': 5 }

interface FormStoreProps {
  datatype?: string
  schema?: any
  theme?: any
  ref?: string
  id: string;
  activePath?: string;
  timestamp?: { [key: string]: number };
  page?: number;
  data: any;
  error: any;
  readonly?: boolean;
  rules?: any;
  accessMode: string;
  watchedPaths?: { [key: string]: string[] };
  ruleResults?: { [key: string]: any[] };
  activePage?: number;
  notice?: { message: string, type: string, duration: number };
  collections?: any
  showNotice?: (message: string, type: string) => void;
  refreshPath?(path: string): void;
  setStateItem: (item: { [key: string]: any }) => void;
  getStateItem: (key: string) => any;
  getSchemaItem?: (path: string) => any;
  getItemValue?: (path: string) => any;
  getDefaultValue?: (path: string, schema?: any, schemaPath?: string, data?: any) => any;
  getError: (path: string, startsWith?: boolean) => any;
  updateError: (path: string, message?: string) => void;
  setItemValue?: (path: string, value: any, arrayIndex?, silent?: boolean) => void;
  updateData: (key: string, value?: string) => void;
  initForm: (data: any, path: string, schema: any, rules, theme) => void;
  removeArrayValue?: (path: string, index) => void;
  updateWatchedPath?: (watcher: string, paths: string[]) => void;
  applyRuleResult?: (path, schema?) => any;
}

export const useFormStore = create<FormStoreProps>()((set, get) => ({
  id: '',
  accessMode: '1',
  activePage: 0,
  error: {},
  data: {},
  watchedPaths: {},
  timestamp: {},
  collections: [],
  showNotice: (message, type) => set({ notice: { message, type, duration: 2000 } }),
  initForm: ({ data, path, schema, rules, theme, accessMode, id, datatype }) => {
    set(({ data: {}, activePath: null, id: null, ref: null, rules: null, schema: null, datatype: null, accessMode: '', timestamp: {}, error: {}, readonly: false, page: 0 }));
    set(({ data, schema, activePath: path, rules, theme, accessMode, id, datatype, timestamp: {} }));
  },
  setStateItem: (item: { [key: string]: any }) => set((state: any) => ({ ...item })),
  getStateItem: (key: string) => get()[key],
  updateError: (dataPath: string, message?: string) => set(state => {
    const error = produce(state.error, draft => {
      delete draft['root'];
      if (!message) {
        delete draft[dataPath];
        return draft;
      }
      draft[dataPath] = message;
    })
    return { error: error, timestamp: { ...state.timestamp, [dataPath]: Date.now() } }
  }),
  getError: (dataPath: string, startsWith = false) => {
    if (startsWith) {
      const keys = Object.keys(get().error).filter(key => key.startsWith(dataPath));
      return keys.map(key => get().error[key]);
    }
    if (!dataPath) return get().error;
    return get().error[dataPath]
  },
  updateData: (key: string, value?: string) => set(state => ({ ...state.data, [key]: value })),
  getItemValue: (dataPath) => {
    if (!dataPath) return get().data;
    return objectPath.get(get().data, dataPath);
  },
  getDefaultValue: (dataPath, schema?, schemaPath?, data?) => {
    schema = schema || get().getSchemaItem(schemaPath);
    if (!schema || !schema.default) return;
    const defaultValue = schema.default;
    if (typeof defaultValue === 'object') {
      return deepCopy(defaultValue);
    } else if (typeof defaultValue === 'string' && defaultValue?.startsWith('{{') && defaultValue?.endsWith('}}')) {
      return getTemplateValue(defaultValue, '', data || get().data);
    } else {
      return defaultValue;
    }

    // const schema = get().schema;
    // const value = objectPath.get(schema, dataPath);
    // return value;
  },
  updateWatchedPath: (watcher, paths) => {
    const watchedPaths = produce(get().watchedPaths, draft => {
      paths.forEach(path => {
        if (!draft[path]) draft[path] = [];
        const watcherSet = new Set(draft[path]);
        watcherSet.add(watcher);
        draft[path] = Array.from(watcherSet);
      })
    })
    set({ watchedPaths: watchedPaths });
  },
  setItemValue: (dataPath, value, arrayIndex?, silent = false) => {
    if (typeof value === 'undefined' || value === null) {
      objectPath.del(get().data, dataPath);
    } else {
      objectPath.set(get().data, dataPath, value);
    }
    if (silent) {
      set({ data: get().data });
    } else {
      set({ data: get().data, timestamp: { ...get().timestamp, [dataPath]: Date.now() } });
    }

    let watchedPaths = dataPath;
    if (arrayIndex !== undefined) {
      watchedPaths = dataPath.replace(`.${arrayIndex}`, '');
    }
    const hasWatchers = get().watchedPaths[watchedPaths]
    if (isNotEmpty(hasWatchers)) {
      const timestamp = { ...get().timestamp };
      for (const wp of hasWatchers) {
        timestamp[wp] = Date.now();
      }
      set({ timestamp: timestamp });
    }
  },
  getSchemaItem: path => {
    return objectPath.get(get().schema, path);
  },
  applyRuleResult: (path?, schema?) => {
    let rulesResult = get().ruleResults;
    if (!rulesResult) return schema;
    const data = deepCopy(get().data);
    const timestamp = {};

    if (path) {
      const pathRules = rulesResult[path];
      if (!pathRules) return schema;
      pathRules.forEach(rule => {
        if (rule.operator === 'hide') {
          schema = { ...schema, hidden: true }
        } else if (rule.operator === 'show') {
          schema = { ...schema, hidden: false }
        } else if (rule.operator === 'set-property') {
          const rawValue = getTemplateValue(rule.value, '', data);
          objectPath.set(schema, rule.field, rawValue);
        }
      })
      return schema;
    } else {
      Object.keys(rulesResult).forEach(path => {
        timestamp[path] = Date.now();
        const pathRules = rulesResult[path];
        pathRules.forEach(rule => {
          if (rule.operator === 'set-value') {
            const rawValue = getTemplateValue(rule.value, '', data);
            objectPath.set(data, path, rawValue);
          }
        })
      })
      get().setStateItem({ data, timestamp });
    }
  },
  removeArrayValue: (path, index) => {
    const array = objectPath.get(get().data, path);
    array.splice(index, 1);
    objectPath.set(get().data, path, array);
    set({ data: get().data, timestamp: { ...get().timestamp, [path]: Date.now() } });
  },
  refreshPath: (path) => {
    set({ timestamp: { ...get().timestamp, [path]: Date.now() } });
  },
}));

export const getFormLayout = (schema) => {
  const layout = schema['x-layout']
  return formLayouts[layout?.type?.toLowerCase()];
}

const formLayouts = {
  accordion: FormLayoutAccordion,
  tab: FormLayoutTab,
  slide: FormLayoutSlider,
}