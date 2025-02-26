import { deepCopy } from '../utils';
import { buttonProps, generatedProps, getContainerLayoutProps, getControlProps, getDataSourceProps, getLayoutProps } from './all-control-props';

const uuidIncludes = ['name', 'icon', 'group', 'layoutGroup', 'title', 'description', 'hideLabel', 'labelPosition', 'iconPosition', 'hidden', 'repeatable'];
const uuid = getControlProps([], uuidIncludes);
const label = deepCopy(uuid);

const buttonIncludes = ['name', 'icon', 'group', 'layoutGroup', 'title', 'description', 'iconPosition'];
const button = getControlProps([], buttonIncludes);
button.schema.properties = { ...button.schema.properties, ...buttonProps() };

const generated = deepCopy(uuid);
generated.schema.properties = { ...generated.schema.properties, ...generatedProps };

const paragraphIncludes = ['name', 'group', 'layoutGroup', 'collapsible', 'default', 'hideLabel'];
const paragraph = getControlProps([], paragraphIncludes);
paragraph.schema.properties.default['x-control'] = 'richtext';
const legalconsent = deepCopy(paragraph);

const dataviewIncludes = ['name', 'group', 'layoutGroup', 'collapsible', 'hideLabel', 'watchedPaths'];
const dataview = getControlProps([], dataviewIncludes);

const textExclude = ['nameValuePair', 'min', 'preSelect', 'max', 'step', 'enum', 'options', 'maxSize', 'fileTypes', 'operations', 'showIndex'];
const text = getControlProps(textExclude);
text.schema.properties['x-control-variant'].enum = ['text', 'text-area', 'radio', 'checkbox', 'number', 'password', 'email', 'phone', 'color', 'date', 'time', 'date-time'];

const numberExclude = ['nameValuePair', 'format', 'preSelect', 'unique', 'prefix', 'suffix', 'enum', 'options', 'fileTypes', 'operations', 'showIndex'];
const number = getControlProps(numberExclude);
number.schema.properties['x-control-variant'].enum = ['input', 'vertical', 'horizontal'];
const numberrange = deepCopy(number);
const date = deepCopy(number);
date.schema.properties['x-control-variant'].enum = ['date', 'date-time', 'time'];
delete date.schema.properties.step;
const daterange = deepCopy(date);
const rating = deepCopy(number);

const inputExclude = [
  'nameValuePair',
  'preSelect',
  'x-control-variant',
  'transform',
  'format',
  'prefix',
  'suffix',
  'fn',
  'format',
  'minItems',
  'maxSize',
  'maxItems',
  'fileTypes',
  'minLength',
  'maxLength',
  'pattern',
  'min',
  'max',
  'step',
  'enum',
  'options',
  'operations',
  'showIndex',
];
const email = getControlProps(inputExclude);
const phone = deepCopy(email);
const cron = deepCopy(email);
const address = deepCopy(email);
const payment = deepCopy(email);
delete payment.schema.properties.placeholder;
const map = deepCopy(payment);

const colorExclude = [
  'nameValuePair',
  'preSelect',
  'placeholder',
  'transform',
  'format',
  'prefix',
  'suffix',
  'fn',
  'format',
  'minItems',
  'maxSize',
  'maxItems',
  'fileTypes',
  'minLength',
  'maxLength',
  'pattern',
  'min',
  'max',
  'step',
  'enum',
  'options',
  'operations',
  'showIndex',
];
const color = getControlProps(colorExclude);
color.schema.properties['x-control-variant'].enum = ['github', 'sketch', 'chrome', 'photoshop', 'gradient'];

const codeExclude = ['nameValuePair', 'format', 'preSelect', 'prefix', 'suffix', 'fn', 'format', 'fileTypes', 'pattern', 'min', 'max', 'step', 'enum', 'options', 'operations', 'showIndex'];
const code = getControlProps(codeExclude);
code.schema.properties['x-control-variant'].enum = ['html', 'css', 'javascript', 'json', 'yaml', 'xml', 'plaintext', 'powershell', 'markdown', 'mdx', 'sql'];

const richtext = deepCopy(code);
delete richtext.schema.properties['x-control-variant'];
const markdown = deepCopy(code);
delete markdown.schema.properties['x-control-variant'];

const selectExclude = ['nameValuePair', 'format', 'prefix', 'suffix', 'fn', 'format', 'transform', 'minLength', 'fileTypes', 'maxLength', 'pattern', 'min', 'max', 'step', 'unique', 'operations', 'showIndex'];
const selectmany = getControlProps(selectExclude);
selectmany.schema.properties.dataSource = getDataSourceProps();
selectmany.schema.properties['x-control-variant'].enum = ['list', 'combo', 'checkbox', 'radio', 'switch', 'data-picker'];
const selectsingle = deepCopy(selectmany);
delete selectmany.schema.properties.options.hidden;
selectsingle.schema.properties['x-control-variant'].enum = ['radio', 'checkbox', 'switch'];
const ranking = deepCopy(selectmany);
delete ranking.schema.properties.topics.hidden;
ranking.schema.properties['x-control-variant'].enum = ['select', 'number', 'checkbox', 'radio', 'slider'];
const sociallinks = deepCopy(selectmany);

const fileIncludes = [
  'name',
  'icon',
  'group',
  'title',
  'x-control-variant',
  'fileTypes',
  'description',
  'placeholder',
  'hideLabel',
  'maxItems',
  'minItems',
  'maxSize',
  'labelPosition',
  'popup',
  'collapsible',
  'disabled',
  'repeatable',
  'hidden',
  'readOnly',
  'inputRequired',
  'x-props',
];
const file = getControlProps([], fileIncludes);
file.schema.properties['x-control-variant'].enum = ['file', 'upload'];

const iconIncludes = ['name', 'icon', 'group', 'title', 'description', 'x-control-variant', 'hideLabel', 'labelPosition', 'collapsible', 'disabled', 'hidden', 'readOnly', 'repeatable', 'inputRequired', 'x-props'];
const icon = getControlProps([], iconIncludes);
icon.schema.properties['x-control-variant'].enum = ['inline', 'popup'];

const layoutIncludes = ['name', 'icon', 'group', 'title', 'description', 'hideLabel', 'labelPosition', 'hidden', 'x-props'];
const layout = getControlProps([], layoutIncludes);

const containerIncludes = [
  'name',
  'icon',
  'title',
  'description',
  'disabled',
  'x-control-variant',
  'operations',
  'layoutGroup',
  'hideLabel',
  'popup',
  'showIndex',
  'readOnly',
  'minItems',
  'maxItems',
  'labelPosition',
  'hidden',
  'x-props',
  'repeatable',
  'collapsible',
  'itemsCollapsible',
  'hideItemLabel',
];

const arraycontainer = getControlProps([], containerIncludes);
arraycontainer.schema.properties['layout'] = getContainerLayoutProps();
arraycontainer.schema.properties['x-control-variant'].enum = ['form', 'table'];
arraycontainer.schema.properties.dataSource = getDataSourceProps();

const container = deepCopy(arraycontainer);
delete container.schema.properties.showIndex;
delete container.schema.properties.maxItems;
delete container.schema.properties.minItems;
delete container.schema.properties.hideItemLabel;

const pageIncludes = ['icon', 'title', 'description', 'hideLabel'];
const page = getControlProps([], pageIncludes);

const containerLayoutIncludes = ['name', 'icon', 'title', 'description', 'labelPosition', 'x-props', 'itemsCollapsible'];
const slide = getControlProps([], containerLayoutIncludes);
slide.schema.properties = { ...slide.schema.properties, ...getLayoutProps() };
const tab = deepCopy(slide);
delete tab.schema.properties.autoProgress;
delete tab.schema.properties.validateLayout;
delete tab.schema.properties.slideVariant;
delete tab.schema.properties.slideDirection;
const accordion = deepCopy(tab);

export {
  dataview,
  uuid,
  label,
  page,
  generated,
  payment,
  address,
  map,
  button,
  paragraph,
  text,
  number,
  rating,
  sociallinks,
  legalconsent,
  numberrange,
  ranking,
  email,
  phone,
  date,
  daterange,
  color,
  cron,
  code,
  richtext,
  markdown,
  selectmany,
  selectsingle,
  file,
  icon,
  layout,
  container,
  slide,
  accordion,
  tab,
  arraycontainer,
};
