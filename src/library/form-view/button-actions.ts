import { showNotice, } from '../context/store';
import { validateForm, getFormStore, runFormRules, applyFunction, DataType } from './common-imports';

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
    fn: async ({ storeId, dataPath, actionSchema, email, collectionForm, formData, formSchema, formRules }) => {
      getFormStore(storeId).getState().clearError();
      const validation = validateForm(formData, formSchema);
      if (!validation.valid) {
        getFormStore(storeId)
          .getState()
          .updateBulkError(validation as any);
        console.error('Form validation failed', validation);
        showNotice(validation.message, 'error');
        return;
      }
      const baseData = genericService.createBaseData(collectionForm?.data?.name, '');
      baseData.author = email;
      baseData.data = formData;
      baseData.owner = { datatype: DataType.form, id: collectionForm?.data.name };
      // const response = await .getState().request(appEndpoints.crm_collection_form_submit.name, baseData, `${collectionForm.data.name}/${userEmail}`);
      console.log('submit-form response', baseData, `${collectionForm?.data.name}/${email}`);
      showNotice('Form was successful submitted', 'success');
      // return response
    },
  },
  'validate-form': {
    title: 'Validate Form',
    description: 'Validate the form data',
    fn: ({ dataPath, actionSchema, email, collectionForm, formData, formSchema, formRules }) => {
      const validation = validateForm(formData, formSchema);
      if (!validation.valid) {
        console.error('Form validation failed', validation);
      } else {
      }
      return validation;
    },
  },
  'reset-form': {
    title: 'Reset Form',
    description: 'Reset the form data',
    fn: storeId => {
      getFormStore(storeId).getState().clearData();
    },
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
    fn: ({ dataPath, actionSchema, email, collectionForm, formData, formSchema, formRules }) => {
      window.location.href = actionSchema.args;
    },
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
    fn: ({ formId, dataPath, actionSchema, email, collectionForm, formData, formSchema, formRules }) => {
      const ruleResults = runFormRules(actionSchema.rule, '', '', '', formSchema, formRules, formData, null);
      getFormStore(formId).getState().setStateItem({ ruleResults });
      return ruleResults;
    },
  },
  'run-script': {
    title: 'Run Script',
    description: 'Run a script',
    fn: ({ dataPath, actionSchema, email, collectionForm, formData, formSchema, formRules }) => {
      return applyFunction(actionSchema.script, null, null, formData);
    },
  },
};
