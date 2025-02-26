import { ControlType, DataType, FileInfoSchema, deepCopy, isNotEmpty } from '../utils';
import { ruleOperations } from '../form-view/form-rules';
import { buttonsActions } from '../form-view/button-actions';

export const collectionFieldProps = {
  name: {
    type: 'string',
    pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
    minLength: 3,
    maxLength: 100,
  },
  title: {
    type: 'string',
    group: 'title',
  },
  labelPosition: {
    type: 'string',
    enum: ['auto', 'top', 'end', 'start', 'bottom'],
    group: 'iconPosition',
    default: 'auto',
  },
  icon: {
    type: 'string',
    'x-control': ControlType.icon,
    groupLayout: 'flat',
    group: 'iconPosition',
    styleClass: '!w-40',
  },
  iconPosition: {
    type: 'string',
    enum: ['end', 'start', 'beforeLabel', 'afterLabel'],
    group: 'iconPosition',
    default: 'start',
  },
  description: {
    type: 'string',
  },
  'x-control-variant': {
    type: 'string',
    enum: ['text', 'password', 'textarea'],
    default: 'text',
    group: 'input',
  },
  format: {
    type: 'string',
    enum: ['', 'email', 'uri', 'hostname', 'phone', 'ipv4', 'ipv6', 'regex'],
    group: 'input',
  },
  placeholder: {
    group: 'placeholder',
    type: 'string',
  },
  default: {
    type: 'string',
    group: 'placeholder',
  },
  group: {
    type: 'string',
    group: 'layoutGroup',
  },
  layoutGroup: {
    type: 'string',
    group: 'layoutGroup',
  },
  suffix: {
    type: 'string',
    group: 'suffix',
    groupLayout: 'flat',
  },
  maxLength: {
    type: 'number',
    group: 'min',
  },
  minLength: {
    type: 'number',
    group: 'min',
  },
  prefix: {
    type: 'string',
    group: 'suffix',
    groupLayout: 'flat',
  },
  transform: {
    type: 'array',
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    items: {
      type: 'string',
    },
    dataSource: {
      source: 'json',
      json: ['uppercase', 'lowercase', 'titlecase', 'uri', 'suffix', 'random-string'].map(item => ({ label: item, value: item })),
    },
  },
  fn: {
    type: 'string',
    'x-control-variant': 'textarea',
    description: '(value, data) => { return fn }',
  },
  fileTypes: {
    type: 'array',
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    dataSource: {
      source: 'json',
      json: [
        { label: 'Image', value: 'image/*' },
        { label: 'Audio', value: 'audio/*' },
        { label: 'Video', value: 'video/*' },
        { label: 'PDF Document', value: 'application/pdf' },
        { label: 'Text Document', value: 'text/*' },
        { label: 'All Files', value: '*/*' },
      ],
    },
    items: {
      type: 'string',
    },
  },
  minItems: {
    type: 'number',
    group: 'max-items',
    hidden: true,
    rules: [{ operation: 'isTruthy', valueA: '{{repeatable}}', action: 'show' }],
  },
  maxItems: {
    type: 'number',
    group: 'max-items',
    hidden: true,
    rules: [{ operation: 'isTruthy', valueA: '{{repeatable}}', action: 'show' }],
  },
  maxSize: {
    type: 'number',
    group: 'max-items',
  },
  unique: {
    type: 'boolean',
    group: 'unique',
  },
  inputRequired: {
    type: 'boolean',
    title: 'Required',
    group: 'unique',
  },
  preSelect: {
    type: 'boolean',
  },
  repeatable: {
    type: 'boolean',
    group: 'unique',
  },
  itemsCollapsible: {
    type: 'boolean',
    group: 'item',
    hidden: true,
  },
  showIndex: {
    type: 'boolean',
    group: 'unique',
  },
  hideLabel: {
    type: 'boolean',
    group: 'disabled',
  },
  hideItemLabel: {
    type: 'boolean',
    group: 'item',
    hidden: true,
  },
  disabled: {
    type: 'boolean',
    group: 'disabled',
  },
  readOnly: {
    type: 'boolean',
    group: 'disabled',
  },
  hidden: {
    type: 'boolean',
    group: 'hidden',
  },
  collapsible: {
    type: 'boolean',
    group: 'hidden',
  },
  editable: {
    type: 'boolean',
    group: 'editable',
  },
  popup: {
    type: 'boolean',
    group: 'hidden',
  },
  hideIn: {
    type: 'array',
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    dataSource: {
      source: 'json',
      json: ['table', 'form', 'card', 'notification', 'web', 'mobile', 'email', 'sms', 'print', 'export'],
    },
  },
  operations: {
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    type: 'string',
    dataSource: {
      source: 'json',
      json: ['add', 'delete', 'edit', 'pick'],
    },
  },
  min: {
    type: 'number',
    group: 'min',
  },
  max: {
    type: 'number',
    group: 'min',
  },
  step: {
    type: 'number',
    group: 'min',
  },
  scale: {
    type: 'number',
    group: 'min',
  },
  pattern: {
    type: 'string',
  },
  topics: {
    type: 'array',
    title: 'Topics',
    collapsible: true,
    hidden: true,
    items: {
      type: 'object',
      displayStyle: 'card',
      properties: {
        icon: {
          type: 'string',
          'x-control': 'icon',
          hideLabel: true,
          styleClass: '!w-40',
          group: 'icon',
        },
        label: {
          type: 'string',
          group: 'icon',
        },
        value: {
          type: 'string',
          group: 'icon',
        },
        description: {
          type: 'string',
          group: 'description',
          'x-control-variant': 'textarea',
        },
        image: {
          ...FileInfoSchema(),
          group: 'description',
          hideLabel: true,
          styleClass: '!w-40',
        },
      },
    },
  },
  options: {
    type: 'array',
    title: 'Options',
    collapsible: true,
    hidden: true,
    items: {
      type: 'object',
      displayStyle: 'card',
      properties: {
        icon: {
          type: 'string',
          'x-control': 'icon',
          hideLabel: true,
          styleClass: '!w-40',
          group: 'icon',
        },
        label: {
          type: 'string',
          group: 'icon',
        },
        value: {
          type: 'string',
          group: 'icon',
        },
        description: {
          type: 'string',
          group: 'description',
          'x-control-variant': 'textarea',
        },
        image: {
          ...FileInfoSchema(),
          group: 'description',
          hideLabel: true,
          styleClass: '!w-40',
        },
      },
    },
  },
  dataSource: {},
  validations: {
    type: 'array',
    collapsible: true,
    items: {
      type: 'object',
      properties: {
        validation: {
          type: 'string',
          'x-control': ControlType.selectMany,
          highlightOption: true,
          displayStyle: 'outlined',
          dataSource: {
            source: 'json',
            json: Object.keys(ruleOperations).map(item => ({ label: item, value: item })),
          },
        },
        arg: {
          type: 'string',
          'x-control-variant': 'chip',
          'x-control': ControlType.selectMany,
          rules: [
            {
              operation: 'notIn',
              valueA: Object.keys(ruleOperations)
                .filter(key => ruleOperations[key].info)
                .map(key => key),
              valueB: '{{validation}}',
              action: 'hide',
            },
          ],
          highlightOption: true,
          dataSource: {
            source: 'json',
            json: [],
          },
        },
        message: {
          type: 'string',
        },
      },
    },
  },
  watchedPaths: {
    type: 'array',
    collapsible: true,
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    items: {
      type: 'string',
    },
    dataSource: {
      source: 'json',
      json: [''],
    },
  },
  rules: {
    type: 'object',
    'x-control': ControlType.code,
    'x-control-variant': 'json',
    popup: {
      inline: true,
      style: { width: '800px' },
    },
  },
  'x-props': {
    title: 'Style & Tailwind',
    type: 'object',
    hidden: true,
    collapsible: true,
    properties: {
      collapsible: true,
    },
  },
};

export const buttonProps = () => ({
  action: {
    type: 'string',
    'x-control': ControlType.selectMany,
    dataSource: {
      source: 'json',
      json: Object.entries(buttonsActions).map(([key, action]) => ({ label: action.title, value: key })),
    },
  },
  args: {
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    type: 'string',
    dataSource: {
      source: 'json',
      // json: buttonsActions.goto.options
    },
    rules: [
      { operation: 'notIn', valueA: ['goto', 'link', 'set-property', 'run-rule'], valueB: '{{action}}', action: 'hide' },
      { operation: 'notIn', valueA: ['goto'], valueB: '{{action}}', action: 'set-property', property: [{ key: 'x-control', value: '' }] },
    ],
  },
  script: {
    type: 'string',
    'x-control': ControlType.code,
    'x-control-variant': 'javascript',
    css: { height: 400 },
    default: '/*\n Any valid javascript\n*/ \r\nconsole.log(data);\r\n\r\n\r\nreturn data;',
    rules: [{ operation: 'notIn', valueA: ['run-script'], valueB: '{{action}}', action: 'hide' }],
    popup: {
      inline: true,
      style: { width: '800px' },
    },
  },
});

export const generatedProps = {
  type: {
    type: 'string',
    enum: ['timestamp', 'uuid', 'count', 'formula'],
    group: 'when',
  },
  when: {
    type: 'string',
    title: 'When to Generate',
    enum: ['onAdd', 'onUpdate'],
    group: 'when',
  },
  formula: {
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    type: 'array',
    maxItems: 1,
    dataSource: {
      source: 'json',
      json: ['join', 'concat', 'replace', 'substring', 'prefix', 'suffix', 'random-number', 'random-string', 'script'].map(item => ({ label: item, value: item })),
    },
    rules: [{ operation: 'notEqual', valueA: 'formula', valueB: '{{type}}', action: 'hide' }],
    items: {
      type: 'string',
    },
  },
};

export const getLayoutProps = () => ({
  hideLabel: {
    type: 'boolean',
    group: 'hidden',
  },
  hidden: {
    type: 'boolean',
    group: 'hidden',
  },
  collapsible: {
    type: 'boolean',
    group: 'hidden',
  },
  validateLayout: {
    type: 'boolean',
    group: 'layout',
  },
  autoProgress: {
    type: 'boolean',
    group: 'layout',
  },
  slideVariant: {
    type: 'string',
    enum: ['slide-and-scale', 'slide-fast'],
    group: 'slide-style',
  },
  slideDirection: {
    type: 'string',
    enum: ['horizontal', 'vertical'],
    group: 'slide-style',
  },
});

export const getDataSourceProps = () => ({
  type: 'object',
  collapsible: true,
  properties: {
    source: {
      type: 'string',
      enum: ['store', 'collection', 'json', 'url', 'self'],
    },
    value: {
      type: 'string',
      rules: [
        {
          operation: 'equal',
          valueA: 'store',
          valueB: '{{source}}',
          action: 'set-property',
          property: [{ key: 'enum', value: ['countries', 'country-regions', 'social-accounts', 'from-accounts', 'message-recipients', 'assign-to', 'customers', 'users'] }],
        },
        {
          operation: 'equal',
          valueA: 'collection',
          valueB: '{{source}}',
          action: 'set-property',
          property: [
            { key: 'enumx', value: '{{datastore.collections}}' },
            { key: 'x-control', value: ControlType.selectMany },
            { key: 'dataSource', value: { source: 'collection', collection: DataType.collection, value: 'name', label: 'name' } },
          ],
        },
        { operation: 'equal', valueA: 'self', valueB: '{{source}}', action: 'set-property', property: [{ key: 'enum', value: '{{self.keys}}' }] },
        {
          operation: 'equal',
          valueA: 'json',
          valueB: '{{source}}',
          action: 'set-property',
          property: [
            { key: 'x-control', value: 'code' },
            { key: 'x-control-variant', value: 'json' },
            { key: 'popup', value: { inline: true, style: { width: '800px' } } },
          ],
        },
      ],
    },
    labelField: {
      type: 'string',
      'x-control': ControlType.selectMany,
      'x-control-variant': 'chip',
      group: 'label',
    },
    valueField: {
      type: 'string',
      group: 'label',
    },
    filter: {
      type: 'object',
      layout: 'horizontal',
      properties: {
        value: {
          type: 'string',
        },
        property: {
          type: 'string',
        },
        operation: {
          type: 'string',
          enum: ['equal', 'notEqual', 'in', 'notIn', 'startsWith', 'endsWith'],
        },
      },
    },
  },
});

export const getContainerLayoutProps = () => {
  return {
    layout: {
      type: 'string',
      enum: ['horizontal', 'vertical', 'table'],
    },
  };
};

export const getControlProps = (excludes?, includes?) => {
  const baseProps = {
    schema: {
      type: 'object',
      properties: {},
      required: ['name'],
    },
    rules: [],
  };

  if (isNotEmpty(excludes)) {
    Object.keys(collectionFieldProps)
      .filter(key => !excludes.includes(key))
      .forEach(key => {
        baseProps.schema.properties[key] = collectionFieldProps[key];
      });
  }
  if (isNotEmpty(includes)) {
    Object.keys(collectionFieldProps)
      .filter(key => includes.includes(key))
      .forEach(key => {
        baseProps.schema.properties[key] = collectionFieldProps[key];
      });
  }

  return deepCopy(baseProps);
};
