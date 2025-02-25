import { classNames, isEmpty, toSentenceCase, toTitleCase, isNotEmpty } from '../utils';
import { ElementCommonDesign } from './element-common-design';
import { ElementCommonView } from './element-common-view';
import { elementStyleClassMap } from '../control-props/element-style-class';
import { buttonsActions } from '../form-view/button-actions';
import { getElementTheme, getFormStore } from '../context/store';
import * as objectPath from 'object-path';
import { dotPathToDash } from './element-helpers';
import { getSelectOptions, getWatchedPaths } from '../form-view/form-utils';
import { applyFormTransform, applyFunction } from '../form-view/form-transforms';
import { runElementRules, runFormRules } from '../form-view/form-rules';
import { validateFormValue } from '../form-view/form-validator';

// Stub for missing dependencies
const twMerge = (...classLists: string[]) => classLists.join(' ');
const cleanControlType = (type: string) => type?.toLowerCase() || 'text';
const getControlType = (schema: any) => schema?.type === 'string' ? 'text' : schema?.type || 'text';
const Icon = (props: { name: any; size?: any; color?: any }) => null;

export {
  ElementCommonDesign,
  ElementCommonView,
  elementStyleClassMap,
  buttonsActions,
  getElementTheme,
  objectPath,
  isNotEmpty,
  getFormStore,
  classNames,
  isEmpty,
  toSentenceCase,
  toTitleCase,
  twMerge,
  dotPathToDash,
  getSelectOptions,
  getWatchedPaths,
  cleanControlType,
  getControlType,
  applyFormTransform,
  applyFunction,
  runElementRules,
  runFormRules,
  validateFormValue,
  Icon,
};
