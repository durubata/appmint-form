import React, { useEffect } from 'react';
import { useFormStore } from './form-store';
import { ElementCommonView } from '../form-elements/element-common-view';
import { FormRender } from './form-render';
import { classNames, deepCopy } from '../utils';
import { validateForm } from './form-validator';
import { LoadingIndicator } from '../common/loading-indicator';

export const CollectionForm = (props: { data, path, schema, rules, theme, accessMode, id, datatype }) => {
    const shouldReload = (ov, nv) => {
        if (ov.schema !== nv.schema) return false;
        if (ov.activePage !== nv.activePage) return false;
        if (ov.timestamp['root'] !== nv.timestamp['root']) return false;
        return true;
    }
    const { schema, initForm, getItemValue, getSchemaItem, setStateItem, activePage, getError, updateError, } = useFormStore(state => state, shouldReload);

    console.log('CollectionForm')

    useEffect(() => {
        getSchemaItem({ watchedPaths: {} })
    }, []);


    useEffect(() => {
        const { data, path, schema, rules, theme, accessMode, id, datatype } = props;
        initForm({ data, path, schema, rules, theme, accessMode, id, datatype })
    }, [props]);

    const prevPage = () => {
        if (activePage === 0) return;
        const _activePage = activePage - 1;
        setStateItem({ activePage: _activePage, error: {} });
    }

    const nextPage = () => {
        updateError('root', null)

        const errors = getError()
        if (errors && Object.keys(errors).length > 0) {
            const allErrors = Object.keys(errors).filter(k => k !== 'root').map(k => errors[k]).join(', ')
            updateError('root', allErrors)
            return;
        }
        const targetSchema = getSchemaItem(path)
        const thisSchema: any = { type: targetSchema.type }
        if (targetSchema.type === 'object') {
            thisSchema.properties = deepCopy(targetSchema.properties);
        } else if (targetSchema.type === 'array' && targetSchema.items?.type === 'object') {
            thisSchema.items = deepCopy(targetSchema.items);
        } else if (targetSchema.type === 'array') {
            thisSchema.items = deepCopy(targetSchema.items);
            thisSchema.items.required = targetSchema.items.inputRequired ? [targetSchema.items.name] : [];
        }
        const validationResult = validateForm(getItemValue(''), thisSchema);
        if (validationResult.valid) {
            if (activePage === schema?.pages?.length - 1) {
                console.log('submit')
                return;
            } else {
                const _activePage = activePage + 1;
                setStateItem({ activePage: _activePage });
            }
        } else {
            updateError('root', validationResult.message)
        }
    }

    if (!schema) return <div className='flex flex-col items-center justify-center h-full w-full'>
        <div className='text-xs text-red-400 text-center '>no schema defined</div>
        <LoadingIndicator />
    </div>;

    const path = activePage > 0 ? 'pages.' + activePage : ''
    const errorMsg = getError('root')
    console.log('errorMsg', errorMsg)
    return (
        <div className='w-full h-full'>
            <ElementCommonView path='' name='cb-form' ui={schema['x-ui']} className='overflow-auto py-5 h-full'>
                {errorMsg && <ElementCommonView ui={schema['x-ui']} path={path} name={'control-error'} className='cb-control-help text-xs text-red-400'>{errorMsg}</ElementCommonView>}
                <FormRender path={props.path || path} className='h-full w-full' name={''} dataPath={''} />
            </ElementCommonView>
            {schema?.pages?.length > 1 && (
                <div className='flex justify-between text-sm my-2'>
                    <button className={classNames(activePage === 0 && 'disabled', " hover:bg-gray-100 disabled:hover:bg-white py-1 px-4 rounded-lg shadow disabled:text-gray-200")} onClick={prevPage} >
                        Back
                    </button>
                    <button className="hover:bg-gray-100 py-1 px-4 rounded-lg shadow" onClick={nextPage}>
                        {activePage === schema?.pages?.length - 1 ? 'Submit' : 'Next'}
                    </button>

                </div>
            )}
        </div>
    )

};
