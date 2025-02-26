import { showNotice, getFormStore } from '../context/store';
import { validateForm } from './form-validator';
import { runFormRules } from './form-rules';
import { applyFunction } from './form-transforms';
import { DataType } from '../utils';

// Stub for genericService
const genericService = {
  createBaseData: (name: string, id: string) => {
    return {
      name,
      id: id || '',
      data: {},
      author: '',
      owner: {}
    };
  }
};

export const buttonsActions = {
  'submit-form': {
    title: 'Submit Form',
    description: 'Submit the form data to the server',
  },
  'validate-form': {
    title: 'Validate Form',
    description: 'Validate the form data',
  },
  'reset-form': {
    title: 'Reset Form',
    description: 'Reset the form data',
  },
  // 'goto': {
  //     title: 'Goto',
  //     description: 'Navigate to a different page',
  //     options: ['Next Item', 'Prev Item', 'First Item', 'Last Item', 'Next Page', 'Prev Page', 'Last Page', 'First Page'],
  //     fn: (path) => {
  //         getFormStore(storeId).getState().goto(path);
  //     }
  // },
  link: {
    title: 'Link',
    description: 'Open a new page',
  },
  // 'set-property': {
  //     title: 'Set Property',
  //     description: 'Set a property value',
  //     fn: (path, value) => {
  //         getFormStore(storeId).getState().setItemValue(path, value);
  //     }
  // },
  'run-rule': {
    title: 'Run Rule',
    description: 'Run a rule',
  },
  'run-script': {
    title: 'Run Script',
    description: 'Run a script',
  },
};
