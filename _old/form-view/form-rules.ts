import { isEmpty, isNotEmpty } from "../utils";
import { getTemplateValue, validateValue } from "./form-validator";

export const runFormRules = (name, path, dataPath, newValue, schema, rules, data) => {
  // console.log('runFormRules', { name, path, dataPath, newValue, schema, rules, data })
  if (!rules) return null;
  const ruleResults = [];
  for (let rule of rules) {
    if (isEmpty(rule.actions) || isEmpty(rule.operations)) {
      console.warn('Skipping: rule incomplete, actions and operations are required', rule)
      continue
    }

    let ruleResult;
    for (let operation of rule.operations) {
      let valueA
      if (isNotEmpty(operation.valueA)) {
        const [firstItem] = operation.valueA
        if (firstItem?.startsWith('{{') && firstItem?.endsWith('}}')) {
          valueA = getTemplateValue(firstItem, '', data)
        } else {
          valueA = operation.valueA
        }
      }

      let valueB
      if (isNotEmpty(operation.valueB)) {
        const [firstItem] = operation.valueB
        if (firstItem?.startsWith('{{') && firstItem?.endsWith('}}')) {
          valueB = getTemplateValue(firstItem, '', data)
        } else {
          valueB = operation.valueB
        }
      }
      const result = validateValue(operation.operator, valueA, valueB, '')
      const allValid = ruleResult ? ruleResult.valid && result.valid : result.valid
      ruleResult = { ...rule, valid: allValid }
      if (rule.join === 'or' && ruleResult.valid) {
        break;
      }
      if (rule.join === 'and' && !ruleResult.valid) {
        break;
      }
    }
    ruleResults.push(ruleResult)
  }
  const resultByPath = {};
  ruleResults.forEach(rule => {
    rule.actions.forEach(action => {
      if ((typeof action.when === 'undefined' || action.when === 'true') && rule.valid) {
        const { operator, value, fields } = action
        fields.forEach(field => {
          resultByPath[field] = resultByPath[field] || [];
          const pathActions = resultByPath[field];
          pathActions.push({ operator, field, value })
        })
      } else if (action.when === 'false' && !rule.valid) {
        const { operator, value, fields } = action
        fields.forEach(field => {
          resultByPath[field] = resultByPath[field] || [];
          const pathActions = resultByPath[field];
          pathActions.push({ operator, field, value })
        })
      }
    })
  })

  return resultByPath
}

export const ruleOperations = {
  equal: { operation: 'equal', args: ['valueA', 'valueB'], message: 'This field must be equal to {{valueB}}', label: 'Equal', info: 'value' },
  notEqual: { operation: 'notEqual', args: ['valueA', 'valueB'], message: 'This field must not be equal to {{valueB}}', label: 'Not Equal', info: 'value' },
  greaterThan: { operation: 'greaterThan', args: ['valueA', 'valueB'], message: 'This field must be greater than {{valueB}}', label: 'Greater Than' },
  lessThan: { operation: 'lessThan', args: ['valueA', 'valueB'], message: 'This field must be less than {{valueB}}', label: 'Less Than' },
  greaterThanOrEqual: { operation: 'greaterThanOrEqual', args: ['valueA', 'valueB'], message: 'This field must be greater than or equal to {{valueB}}', label: 'Greater Than or Equal' },
  lessThanOrEqual: { operation: 'lessThanOrEqual', args: ['valueA', 'valueB'], message: 'This field must be less than or equal to {{valueB}}', label: 'Less Than or Equal' },
  in: { operation: 'in', args: ['valueA', 'valueB'], message: 'This field must be in the list of values {{valueB}}', label: 'In', info: 'value or separated by ,' },
  notIn: { operation: 'notIn', args: ['valueA', 'valueB'], message: 'This field must not be in the list of values {{valueB}}', label: 'Not In', info: 'value or separated by ,' },
  startsWith: { operation: 'startsWith', args: ['valueA', 'valueB'], message: 'This field must start with {{valueB}}', label: 'Starts With', info: 'value' },
  notStartsWith: { operation: 'notStartsWith', args: ['valueA', 'valueB'], message: 'This field must not start with {{valueB}}', label: 'Not Starts With', info: 'value' },
  endsWith: { operation: 'endsWith', args: ['valueA', 'valueB'], message: 'This field must end with {{valueB}}', label: 'Ends With', info: 'value' },
  notEndsWith: { operation: 'notEndsWith', args: ['valueA', 'valueB'], message: 'This field must not end with {{valueB}}', label: 'Not Ends With', info: 'value' },
  match: { operation: 'match', args: ['valueA', 'valueB'], message: 'This field must match the pattern {{valueB}}', label: 'Matches', info: 'RegEx pattern' },
  notMatch: { operation: 'notMatch', args: ['valueA', 'valueB'], message: 'This field must not match the pattern {{valueB}}', label: 'Not Matches', info: 'RegEx pattern' },
  isEmpty: { operation: 'isEmpty', args: ['valueA'], message: 'This field must be empty', label: 'Is Empty' },
  isNotEmpty: { operation: 'isNotEmpty', args: ['valueA'], message: 'This field must not be empty', label: 'Is Not Empty' },
  isTruthy: { operation: 'isTruthy', args: ['valueA'], message: 'This field must be truthy', label: 'Is Truthy' },
  isFalsy: { operation: 'isFalsy', args: ['valueA'], message: 'This field must be falsy', label: 'Is Falsy' },
  maxLength: { operation: 'maxLength', args: ['valueA'], message: 'This field must be at most {{valueA}} characters', label: 'Max Length', info: 'value' },
  minLength: { operation: 'minLength', args: ['valueA'], message: 'This field must be at least {{valueA}} characters', label: 'Min Length', info: 'value' },
  maxValue: { operation: 'maxValue', args: ['valueA'], message: 'This field must be less than or equal to {{valueA}}', label: 'Max Value', info: 'value' },
  minValue: { operation: 'minValue', args: ['valueA'], message: 'This field must be greater than or equal to {{valueA}}', label: 'Min Value', info: 'value' },
  isEmail: { operation: 'isEmail', args: ['valueA'], message: 'This field must be a valid email address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', label: 'Is Email' },
  isUrl: { operation: 'isUrl', args: ['valueA'], message: 'This field must be a valid URL', pattern: '^(http|https)://[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+([/?].*)?$', label: 'Is URL' },
  isNumeric: { operation: 'isNumeric', args: ['valueA'], message: 'This field must be a number', pattern: '^[0-9]+$', label: 'Is Numeric' },
  isAlphaNumeric: { operation: 'isAlphaNumeric', args: ['valueA'], message: 'This field must contain both letters and numbers only', pattern: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$', label: 'Is Alpha Numeric' },
  isAlpha: { operation: 'isAlpha', args: ['valueA'], message: 'This field must contain only letters', pattern: '^[a-zA-Z]+$', label: 'Is Alpha' },
  isDate: { operation: 'isDate', args: ['valueA'], message: 'This field must be a date', label: 'Is Date' },
  isPhone: { operation: 'isPhone', args: ['valueA'], message: 'This field must be a valid phone number', pattern: '^[0-9]{10,14}$', label: 'Is Phone' },
  isZipCode: { operation: 'isZipCode', args: ['valueA'], message: 'This field must be a valid zip code', pattern: '^[0-9]{5}(?:-[0-9]{4})?$', label: 'Is Zip Code' },
  isCreditCard: { operation: 'isCreditCard', args: ['valueA'], message: 'This field must be a valid credit card number', label: 'Is Credit Card' },
  fn: { operation: 'fn', args: ['valueA'], label: 'Custom Function' },
}
