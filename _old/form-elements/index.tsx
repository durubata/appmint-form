import React, { useEffect } from 'react';
import { ButtonElement, elementToNameMap } from './all-elements';
import { ElementWrapperControl } from './element-wrapper-control';
import { useFormStore } from '../form-view/form-store';
import { deepCopy, isNotEmpty } from '../utils';
import { validateFormValue } from '../form-view/form-validator';
import { runFormRules } from '../form-view/form-rules';
import { FormCollapsible } from '../form-view/form-collapsible';
import { FormPopup } from '../form-view/form-popup';
import { applyFormTransform, applyFunction } from '../form-view/form-transforms';
import { ControlType } from '../../src/library/utils/control-type';
import { cleanControlType, getControlType } from '../../src/library/utils/collection-helpers';

export const FormElementRender = (props: { theme?: any, mode: string, name: string; path: string, dataPath: string, schema?, arrayIndex?}) => {
    const { name, path, arrayIndex } = props;
    const dataPath = props.dataPath ? props.dataPath : `${props.dataPath}.${name}`
    const shouldReload = (ov, nv) => {
        if (ov.timestamp[dataPath] !== nv.timestamp[dataPath]) return false;
        if (ov.error[dataPath] !== nv.error[dataPath]) return false;
        return true;
    }
    const { timestamp, getSchemaItem, setStateItem, getItemValue, getDefaultValue, setItemValue, updateError, getError, rules, theme: formTheme, applyRuleResult, datatype, id, updateWatchedPath } = useFormStore(state => state, shouldReload);
    let schema = deepCopy(props.schema || getSchemaItem(path))
    const theme = props.theme || formTheme

    useEffect(() => {
        if (schema.watchedPaths) {
            updateWatchedPath(dataPath, schema.watchedPaths)
        }
    }, [props.schema])

    const dataPathTimestamp = timestamp[dataPath]
    useEffect(() => {
        if (schema.fn && dataPathTimestamp) {
            const parentPath = dataPath.includes('.') ? dataPath.split('.').slice(0, -1).join('.') : ''
            const fnResult = applyFunction(schema.fn, value, getItemValue(parentPath), getItemValue())
            console.log('FormElementRender', dataPath, schema.fn, fnResult)
            if (fnResult.status === 'success') {
                value = fnResult.value
                setItemValue(dataPath, value, arrayIndex, true)
            } else {
                getError(dataPath) !== fnResult.message &&
                    updateError(dataPath, fnResult.message)
            }
        }
    }, [dataPathTimestamp])

    if (arrayIndex >= 0 && schema.items && (schema?.items?.type !== 'object' || schema?.items?.type !== 'array')) {
        const itemSchema = schema.items
        itemSchema.hideLabel = schema?.hideLabel || schema.items?.hideLabel
        itemSchema.pattern = schema?.pattern || schema.items?.pattern
        itemSchema.validation = schema?.validation || schema.items?.validation
        schema = itemSchema
    }

    if (!schema || (props?.mode === 'view' && schema?.hidden)) return null

    if (!path && !name) {
        console.error('FormElementRender: path or name is required')
        return null
    }


    const handleFocus = (newValue) => {

    }

    const handleChange = (newValue) => {
        updateError(dataPath, null)
        const validationResult = validateFormValue(path, newValue, schema)
        if (isNotEmpty(validationResult.errors)) {
            updateError(dataPath, validationResult.message)
        }
        setItemValue(dataPath, newValue, arrayIndex)
    }

    const handleBlur = async (newValue) => {
        updateError(dataPath, null)
        const validationResult = validateFormValue(dataPath, newValue, schema, getItemValue())
        if (isNotEmpty(validationResult.errors)) {
            updateError(dataPath, validationResult.message)
        } else {
            updateError(dataPath, null)

            if (schema.unique && newValue) {
                try {
                    const isUnique = true;//await genericService.uniqueInCollection(datatype, id, name, newValue, '');
                    if (isUnique) {
                        updateError(dataPath, null)
                    } else {
                        updateError(dataPath, ' must be unique');
                    }
                } catch (error) {
                    const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error.message;
                    // notificationStore.showNotification('DataFormError', errorMessage, SiteNotificationType.Error);
                    updateError(dataPath, ' must be unique, error: ' + errorMessage);
                }
            }
        }
        if (schema.transform) {
            newValue = applyFormTransform(newValue, schema.transform)
        }
        setItemValue(dataPath, newValue, arrayIndex)
        const ruleResults = runFormRules(name, path, dataPath, newValue, schema, rules, data)
        setStateItem({ ruleResults })
        applyRuleResult()
    }

    let controlType = schema.fieldType ? schema.fieldType : getControlType(schema);
    controlType = cleanControlType(controlType);
    const Element = elementToNameMap[controlType] || elementToNameMap.default;

    if (controlType === ControlType.button) {
        return <ButtonElement mode={props.mode} schema={schema} name={name} path={path} />
    }

    const ruleSchema = applyRuleResult(dataPath, deepCopy(schema))
    let value = dataPath ? getItemValue(dataPath) : null
    value = !value ? getDefaultValue(dataPath, ruleSchema) : value
    const data = dataPath ? getItemValue('') : {}


    if (props.mode === 'view' && ruleSchema.hidden) return null

    const render = <ElementWrapperControl mode={props.mode} schema={ruleSchema} name={name} path={path} error={getError(dataPath)} theme={theme}>
        <Element change={handleChange} blur={handleBlur} focus={handleFocus} value={value} data={data} schema={ruleSchema} name={name} mode={props.mode} path={path} dataPath={dataPath} theme={theme} />
    </ElementWrapperControl>

    console.log('FormElementRender', dataPath)
    if (ruleSchema.collapsible) return <FormCollapsible title={ruleSchema.title || ruleSchema.name || name} icon={ruleSchema.icon}>   {render} </FormCollapsible>
    if (ruleSchema.popup) return <FormPopup title={ruleSchema.title || ruleSchema.name} icon={ruleSchema.icon}>  {render}  </FormPopup>
    return render
};
