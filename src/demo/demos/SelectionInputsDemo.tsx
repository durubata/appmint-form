import React from 'react';
import CollectionForm from '../../library/form-view';

const schema = {
    type: 'object',
    properties: {
        selectSingle: {
            type: 'string',
            title: 'Select Single (Dropdown)',
            description: 'Single selection dropdown',
            enum: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            default: 'Option 1'
        },
        selectSingleWithLabels: {
            type: 'string',
            title: 'Select Single with Labels',
            description: 'Single selection dropdown with custom labels',
            enum: ['value1', 'value2', 'value3'],
            enumNames: ['Display Label 1', 'Display Label 2', 'Display Label 3'],
            default: 'value1'
        },
        selectMany: {
            type: 'array',
            title: 'Select Many (Multi-select)',
            description: 'Multiple selection control',
            items: {
                type: 'string',
                enum: ['Option A', 'Option B', 'Option C', 'Option D', 'Option E']
            },
            default: ['Option A', 'Option C'],
            'x-control': 'selectmany'
        },
        selectManyCheckbox: {
            type: 'array',
            title: 'Select Many (Checkboxes)',
            description: 'Multiple selection with checkboxes',
            items: {
                type: 'string',
                enum: ['Red', 'Green', 'Blue', 'Yellow', 'Purple']
            },
            default: ['Red', 'Blue'],
            'x-control': 'selectmanycheckbox'
        },
        selectManyRadio: {
            type: 'string',
            title: 'Select Single (Radio)',
            description: 'Single selection with radio buttons',
            enum: ['Small', 'Medium', 'Large', 'X-Large'],
            default: 'Medium',
            'x-control': 'selectmanyradio'
        },
        switch: {
            type: 'boolean',
            title: 'Switch',
            description: 'Boolean toggle switch',
            default: true,
            'x-control': 'switch'
        },
        rating: {
            type: 'number',
            title: 'Rating',
            description: 'Star rating input',
            'x-control': 'rating',
            minimum: 0,
            maximum: 5,
            default: 3
        },
        ranking: {
            type: 'array',
            title: 'Ranking',
            description: 'Drag and drop ranking of items',
            'x-control': 'ranking',
            items: {
                type: 'string'
            },
            default: ['First Item', 'Second Item', 'Third Item', 'Fourth Item']
        }
    }
};

const SelectionInputsDemo: React.FC = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <CollectionForm
                schema={schema}
                id='selection-inputs-demo'
                data={{}}
            />
        </div>
    );
};

export default SelectionInputsDemo;
