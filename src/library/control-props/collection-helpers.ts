import { ControlType, FileInfoSchema, getCountryDropDownOptions } from '../utils';
import * as icons from '../../common/icons';

interface FieldItem {
  type: ControlType | string;
  title: string;
  description: string;
  schema: any;
  icon: any;
}

export const fieldList: FieldItem[] = [
  {
    type: ControlType.paragraph,
    title: 'Paragraph',
    description: 'Add a title, image, instructions to your form',
    icon: 'FaRegNewspaper',
    schema: {
      type: 'string',
      displayStyle: 'simple',
      'x-control': ControlType.paragraph,
    },
  },
  {
    type: ControlType.button,
    title: 'Button',
    description: 'Add action buttons',
    icon: icons.IconClick,
    schema: {
      type: 'string',
      'x-control-variant': 'text',
      'x-control': ControlType.button,
    },
  },
  {
    type: ControlType.container,
    title: 'Container',
    icon: icons.IconTemplateField,
    description: 'Create an Element Group',
    schema: {
      type: 'object',
      properties: {},
      'x-control': ControlType.container,
      'x-control-variant': 'form',
      displayStyle: 'plain',
      collection: '',
    },
  },
  {
    type: ControlType.textfield,
    title: 'Text Field',
    icon: icons.IconTextField,
    description: 'Single line or multiline, Email or Password',
    schema: {
      type: 'string',
      'x-control': ControlType.textfield,
      'x-control-variant': 'text',
    },
  },
  {
    type: ControlType.number,
    title: 'Number Field',
    icon: icons.IconTextField,
    description: 'Number Field',
    schema: {
      type: 'number',
      'x-control': ControlType.number,
      'x-control-variant': 'number',
    },
  },
  {
    type: ControlType.numberRange,
    title: 'Number Range Field',
    icon: 'FaArrowsAltH',
    description: 'Number Range Field',
    schema: {
      type: 'array',
      'x-control': ControlType.numberRange,
      items: {
        type: 'number',
      },
    },
  },
  {
    type: ControlType.richtext,
    title: 'richtext',
    icon: icons.IconRichTextField,
    description: 'A rich test editor with formatting options',
    schema: {
      type: 'string',
      'x-control-variant': 'simple',
      'x-control': ControlType.richtext,
    },
  },
  {
    type: ControlType.markdown,
    title: 'Markdown Editor',
    icon: icons.IconMarkdown,
    description: 'Markdown HTML editor with formatting options',
    schema: {
      type: 'string',
      'x-control-variant': 'simple',
      'x-control': ControlType.markdown,
    },
  },
  {
    type: ControlType.selectSingle,
    title: 'Single Selection',
    icon: icons.IconRadioField,
    description: 'Yes or no',
    schema: {
      type: 'boolean',
      'x-control-variant': 'checkbox',
      'x-control': ControlType.selectSingle,
    },
  },
  {
    type: ControlType.selectMany,
    title: 'Multiple',
    icon: icons.IconSelectField,
    description: 'Select multiple options from a list',
    schema: {
      type: 'string',
      'x-control-variant': 'select',
      'x-control': ControlType.selectMany,
    },
  },
  {
    type: ControlType.lookup,
    title: 'Lookup Data/Field',
    icon: 'MdFindReplace',
    description: 'Lookup from another collection',
    schema: {
      type: 'string',
      'x-control': ControlType.lookup,
    },
  },
  {
    type: ControlType.date,
    title: 'Date',
    icon: icons.IconCalendar,
    description: 'A date picker with hours, minutes and seconds',
    schema: {
      type: 'string',
      format: 'date-time',
      'x-control': ControlType.date,
      'x-control-variant': 'simple',
    },
  },
  {
    type: ControlType.dateRange,
    title: 'Date Range',
    icon: 'BsCalendar4Range',
    description: 'A date range picker',
    schema: {
      type: 'array',
      'x-control': ControlType.dateRange,
      items: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
  {
    type: ControlType.file,
    title: 'Upload',
    icon: icons.IconUpload,
    description: 'Files like documents, images, videos, etc',
    schema: FileInfoSchema(),
  },
  {
    type: ControlType.icon,
    title: 'Icon',
    icon: icons.IconShape,
    description: 'Select icon with a picker',
    schema: {
      type: 'string',
      'x-control-variant': 'simple',
      'x-control': ControlType.icon,
    },
  },
  {
    type: ControlType.code,
    title: 'Code',
    icon: icons.IconCode,
    description: 'Data in JSON, CSS, Javascript format',
    schema: {
      type: 'string',
      'x-control': ControlType.code,
    },
  },
  {
    type: ControlType.uuid,
    title: 'UUID',
    icon: icons.IconUser,
    description: 'Unique Identifier for your collection',
    schema: {
      type: 'string',
      format: 'uuid',
      'x-control': ControlType.uuid,
    },
  },
  {
    type: 'generated',
    title: 'Generated',
    icon: 'TbArrowsJoin',
    description: 'Generated field, for id, and computed fields',
    schema: {
      type: 'string',
      format: 'uuid',
      'x-control': 'generated',
    },
  },
  {
    type: ControlType.color,
    title: 'Color',
    icon: icons.IconColorField,
    description: 'Select color from with a picker',
    schema: {
      type: 'string',
      'x-control-variant': 'simple',
      'x-control': ControlType.color,
    },
  },
  {
    type: ControlType.map,
    title: 'Map',
    icon: icons.IconMap,
    description: 'Map Location',
    schema: {
      type: 'string',
      displayStyle: 'map',
      'x-control': ControlType.map,
    },
  },
  {
    type: ControlType.label,
    title: 'Label Field',
    icon: icons.IconInfo,
    description: 'Label Field',
    schema: {
      type: 'string',
      'x-control': ControlType.label,
    },
  },
  {
    type: ControlType.cron,
    title: 'Cron Field',
    icon: icons.IconSchedule,
    description: 'Cron syntax input',
    schema: {
      type: 'string',
      properties: {},
      'x-control': ControlType.cron,
      'x-control-variant': 'text',
    },
  },
  {
    type: ControlType.phone,
    title: 'Phone Field',
    icon: 'BsPhone',
    description: 'Validate Phone input',
    schema: {
      type: 'string',
      properties: {},
      'x-control': ControlType.phone,
      'x-control-variant': 'text',
    },
  },
  {
    type: 'preselect',
    title: 'Pre Select',
    icon: 'RiListSettingsLine',
    description: 'Select from predefined options and let use add a custom value',
    schema: {
      type: 'string',
      properties: {},
      'x-control': 'preselect',
      'x-control-variant': 'text',
    },
  },
  {
    type: 'rating',
    title: 'Rating',
    icon: 'AiFillStar',
    description: 'Rating input',
    schema: {
      type: 'string',
      properties: {},
      'x-control': 'rating',
      'x-control-variant': 'text',
    },
  },
  {
    type: 'ranking',
    title: 'Ranking',
    icon: 'AiOutlineBarChart',
    description: 'Ranking input',
    schema: {
      type: 'string',
      properties: {},
      'x-control': 'ranking',
    },
  },
  {
    type: 'legalconsent',
    title: 'Legal Concent',
    icon: 'FaGavel',
    description: 'Legal Concent',
    schema: {
      type: 'string',
      'x-control': 'legalconsent',
      properties: {},
    },
  },
  {
    type: 'sociallinks',
    title: 'Social Links',
    icon: 'IoShareSocialSharp',
    description: 'Social Links',
    schema: {
      type: 'string',
      properties: {},
      'x-control': 'sociallinks',
    },
  },
  {
    type: ControlType.address,
    title: 'Address Field',
    icon: 'FaRegAddressBook',
    description: 'Address inputs',
    schema: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
        },
        street2: {
          type: 'string',
        },
        city: {
          type: 'string',
          group: 'city',
        },
        zip: {
          group: 'city',
          type: 'string',
        },
        country: {
          type: 'string',
          'x-control': ControlType.selectMany,
          dataSource: {
            json: getCountryDropDownOptions(),
            source: 'json',
          },
          group: 'state',
        },
        state: {
          type: 'string',
          'x-control': ControlType.selectMany,
          dataSource: {
            value: 'getCountryRegions',
            source: 'function',
            filter: {
              value: '{{address/country}}',
            },
          },
          group: 'state',
        },
      },
      'x-control': ControlType.container,
      'x-control-variant': 'form',
      displayStyle: 'plain',
      collection: '',
    },
  },
  {
    type: 'dataview',
    title: 'Data View',
    icon: 'MdOutlinePageview',
    description: 'Data View',
    schema: {
      type: 'string',
      properties: {},
      'x-control': 'dataView',
    },
  },
];
