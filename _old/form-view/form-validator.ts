
import { deepCopy } from '../utils';
import Ajv from 'ajv';
import * as objectPath from 'object-path';
import { ruleOperations } from './form-rules';

const ajv = new Ajv({
  allErrors: true,
  useDefaults: true,

});

export const getTemplateValue = (key, parentPath, data) => {
  let argValue = key;
  if (typeof key === 'string' && key?.startsWith('{{') && key?.endsWith('}}')) {
    const valueKey: string = key.replace('{{', '').replace('}}', '')
    if (valueKey.startsWith('fn:')) {
      const fnPath = valueKey.replace('fn:', '');
      const fn = fnPath.startsWith('return') ? fnPath : `return ${fnPath}`;
      const tValue = new Function('value', 'data', fn)('', data);
      return tValue
    } else {
      const fullPath = valueKey.includes('.') ? valueKey : parentPath + '.' + valueKey;
      argValue = objectPath.get(data, fullPath)
    }
  }
  return argValue;
}

export const validateForm = (data, schema) => {
  let schemaCopy = deepCopy(schema);
  schemaCopy = replaceIdWithDollarIdAndCleanSchema(schemaCopy);
  schemaCopy = findAndSetRequiredFields(schemaCopy);
  const validate = ajv.compile(schemaCopy);
  const valid = validate(data);
  const validationResults = [];
  if (!valid) {
    console.log("Validation failed:", data, validate.errors);
    validationResults.push({ valid: false, errors: validate.errors, message: validate.errors.map(e => e.message).join(', ') });
  }
  validateSchemaItems('', '', deepCopy(schema), data, validationResults);

  if (validationResults.length) {
    return { valid: false, errors: validationResults.map(v => v.errors), message: validationResults.map(v => v.message).join(', ') };
  }
  return { valid: true }
}

const validateSchemaItems = (path, dataPath, schema, data, store) => {
  if (typeof schema !== 'object') return null;

  const itemSchema = objectPath.get(schema, path);
  const value = objectPath.get(data, dataPath) || {};

  if (itemSchema.type === 'object' || schema.type === 'array') {
    const properties = itemSchema.type === 'array' ? itemSchema.properties.items : itemSchema.properties;
    let basePath = itemSchema.type === 'array' ? 'properties.items' : 'properties';
    basePath = path ? `${path}.${basePath}` : basePath;
    for (let key in properties) {
      if (properties[key].hidden || properties[key].items?.hidden) {
        continue;
      }
      const valuePath = dataPath ? `${dataPath}.${key}` : key;
      if (itemSchema.properties[key].type === 'array' && itemSchema.properties[key].items.type === 'object') {
        validateSchemaItems(`${basePath}.${key}`, valuePath, schema, data, store);
      } else if (itemSchema.properties[key].type === 'object') {
        validateSchemaItems(`${basePath}.${key}`, valuePath, schema, data, store);
      } else {
        const hasItems = itemSchema.properties[key].items;
        let validationResult;
        if (hasItems?.type && (hasItems?.type !== 'object' || hasItems?.type !== 'array')) {
          if (typeof value[key] !== 'undefined') {
            validationResult = validateFormValue(valuePath, value[key], hasItems, data);
          }
        } else {
          if (typeof value[key] !== 'undefined' || itemSchema.properties[key].inputRequired) {
            validationResult = validateFormValue(valuePath, value[key], itemSchema.properties[key], data);
          }
        }
        if (validationResult && !validationResult?.valid) {
          store.push(validationResult);
        }
      }
    }
  } else {
    if (typeof value !== 'undefined' || itemSchema?.inputRequired) {
      const validationResult = validateFormValue(dataPath, value, itemSchema, data);
      if (!validationResult.valid) {
        store.push(validationResult.message);
      }
    }
  }
};

export const validateFormValue = (path, value, schema, data?) => {
  //no validation for hidden fields
  if (!schema || schema.hidden) return { path, valid: true };

  const copySchema = deepCopy(schema)
  //remove minItems or maxItems if undefined and property exist
  if (copySchema.hasOwnProperty('minItems') && !copySchema.minItems) {
    delete copySchema.minItems;
  }
  if (copySchema.hasOwnProperty('maxItems') && !copySchema.maxItems) {
    delete copySchema.maxItems;
  }
  if (copySchema?.properties) {
    Object.keys(copySchema.properties).forEach(key => {
      if (copySchema.properties[key].hidden) {
        delete copySchema.properties[key];
      }
    });
  }

  const validate = ajv.compile(copySchema);
  const valid = validate(value);
  if (!valid) {
    console.log("Validation failed:", path, value, validate.errors);
    return { path, valid: false, errors: validate.errors, message: validate.errors.map(e => e.message).join(', ') }
  }

  if (schema.inputRequired && !value) {
    console.log("Validation failed:", path, value, schema.required);
    return { path, valid: false, errors: [{ message: 'This field is required', path }], message: 'This field is required' }
  }

  if (!value) {
    console.log("Validation successful!, no value and not required");
    return { path, valid: true }
  }

  if (schema.pattern && ['string', 'number'].includes(schema.type)) {
    const result = new RegExp(schema.pattern).test(value as any)
    if (!result) {
      console.log("Validation failed:", path, value, schema.pattern);
      return { path, valid: false, errors: [{ message: 'Pattern does not match', path }], message: 'Pattern does not match' }
    }
  }
  if (schema.validations && ['string', 'number'].includes(schema.type)) {
    const parentPath = path.split('.').slice(0, -1).join('.')
    const results = schema.validations.map(v => {
      let argValue = getTemplateValue(v.arg, parentPath, data)
      return validateValue(v.validation, value, argValue, v.message)
    })
    const errors = results.filter(r => !r.valid).map(r => ({ message: r.message, path }))
    const errorMessage = errors.map(e => e.message).join(', ')

    if (errors.length) {
      return { path, valid: false, errors, message: errorMessage }
    }
  }
  //entityValidations
  return { path, valid: true }
}

export const validateValue = (type, valueA, valueB, message) => {
  const validation = ruleOperations[type]
  if (!validation) return { valid: true }

  let responseMessage;
  switch (type) {
    case 'required':
      if (!valueA) responseMessage = validation.message
      break;
    case 'minLength':
      if (valueA.length < valueB) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'maxLength':
      if (valueA.length > valueB) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'minValue':
      if (valueA < valueB) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'maxValue':
      if (valueA > valueB) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'match':
    case 'pattern':
      try {
        const matchResult = new RegExp(valueB).test(valueA)
        if (!matchResult) {
          responseMessage = validation.message.replace('{{valueB}}', valueB)
        }
      } catch (e) {
        responseMessage = 'Invalid RegExp pattern ' + valueB
        console.error('Invalid RegExp pattern', valueB)
        console.error(e)
      }
      break;
    case 'notMatch':
      try {
        const notMatchResult = new RegExp(valueB).test(valueA)
        if (notMatchResult) responseMessage = validation.message.replace('{{valueB}}', valueB)
      } catch (e) {
        responseMessage = 'Invalid RegExp pattern ' + valueB
        console.error('Invalid RegExp pattern', valueB)
        console.error(e)
      }
      break;
    case 'equal':
      if (valueA !== valueB) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'notEqual':
      if (valueA === valueB) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'in':
      if (typeof valueB === 'string' && typeof valueA === 'string') {
        if (valueB.indexOf(valueA) === -1) responseMessage = validation.message.replace('{{valueB}}', valueB)
      } else if (Array.isArray(valueB) && Array.isArray(valueA)) {
        if (valueA.filter(v => valueB.includes(v)).length !== valueA.length) responseMessage = validation.message.replace('{{valueB}}', JSON.stringify(valueB))
      } else if (Array.isArray(valueB)) {
        if (!valueB.includes(valueA)) responseMessage = validation.message.replace('{{valueB}}', JSON.stringify(valueB))
      } else if (typeof valueB === 'object') {
        if (!valueB[valueA]) responseMessage = validation.message.replace('{{values}}', valueB)
      } else {
        responseMessage = validation.message.replace('{{values}}', valueB)
      }
      break;
    case 'notIn':
      if (typeof valueB === 'string' && typeof valueA === 'string') {
        if (valueB.indexOf(valueA) !== -1) responseMessage = validation.message.replace('{{valueB}}', valueB)
      } else if (Array.isArray(valueB) && Array.isArray(valueA)) {
        if (valueB.filter(v => valueA.includes(v)).length === valueA.length) responseMessage = validation.message.replace('{{valueB}}', JSON.stringify(valueB))
      } else if (Array.isArray(valueB)) {
        if (valueB.includes(valueA)) responseMessage = validation.message.replace('{{valueB}}', JSON.stringify(valueB))
      } else if (typeof valueB === 'object') {
        if (valueB[valueA]) responseMessage = validation.message.replace('{{valueB}}', valueB)
      } else {
        responseMessage = validation.message.replace('{{valueB}}', valueB)
      }
      break;
    case 'startsWith':
      if (!valueA.startsWith(valueB)) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'notStartsWith':
      if (valueA.startsWith(valueB)) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'endsWith':
      if (!valueA.endsWith(valueB)) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'notEndsWith':
      if (valueA.endsWith(valueB)) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'isNull':
    case 'isEmpty':
      if (valueA !== null && valueA !== undefined && valueA !== '' && valueA.length !== 0) responseMessage = validation.message;
      break;
    case 'isNotNull':
    case 'isNotEmpty':
      if (valueA === null || valueA === undefined || valueA.length === 0) responseMessage = validation.message;
      break;
    case 'isFalsy':
      if (valueA) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'isTruthy':
      if (!valueA) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'isDate':
      const date = new Date(valueA);
      if (isNaN(date.getTime())) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    case 'isEmail':
    case 'isURL':
    case 'isPhone':
    case 'isCreditCard':
    case 'isAlpha':
    case 'isNumeric':
    case 'isAlphaNumeric':
      const regResult = new RegExp(validation.pattern).test(valueA)
      if (!regResult) responseMessage = validation.message.replace('{{valueB}}', valueB)
      break;
    default:
      break;
  }
  return { valid: !responseMessage, message: message || responseMessage }
}

const replaceIdWithDollarIdAndCleanSchema = (schema) => {
  if (typeof schema === 'object' && schema !== null) {
    // Remove irrelevant fields for validation
    const keysToRemove = [
      'fieldType', 'inputStyle', 'name', 'unique', 'validations', 'minLength',
      'maxLength', 'collection', 'displayStyle', 'repeatable', 'group',
      'x-layout', 'description', 'title'
    ];

    keysToRemove.forEach(key => {
      delete schema[key];
    });

    if (schema.hasOwnProperty('id')) {
      schema['$id'] = schema['id'];
      delete schema['id'];
    }

    for (let key in schema) {
      if (schema.hasOwnProperty(key)) {
        if (typeof schema[key] === 'object') {
          replaceIdWithDollarIdAndCleanSchema(schema[key]);
        }
      }
    }
  }
  return schema;
};

const findAndSetRequiredFields = (schema, parent = null, parentKey = null) => {
  if (typeof schema === 'object' && schema !== null) {
    if (schema.properties) {
      schema.required = schema.required || [];
      for (let key in schema.properties) {
        if (schema.properties[key].inputRequired === true) {
          if (!schema.required.includes(key)) {
            schema.required.push(key);
          }
          if (parent && !parent.required.includes(parentKey)) {
            parent.required.push(parentKey);
          }
        }
        // Recursively handle nested objects and arrays
        findAndSetRequiredFields(schema.properties[key], schema, key);
      }
    } else if (schema.items) {
      // Handle arrays
      if (Array.isArray(schema.items)) {
        schema.items.forEach(item => findAndSetRequiredFields(item, schema));
      } else {
        findAndSetRequiredFields(schema.items, schema);
      }
    }
  }
  return schema;
};
