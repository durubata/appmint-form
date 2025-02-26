import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CollectionForm from './library/form-view';

const schema = {
    type: 'object',
    properties: {
        text: {
            type: 'string',
            title: 'Text',
            default: '',
        },
        number: {
            type: 'number',
            title: 'Number',
            default: 50,
        },
        slider: {
            type: 'number',
            title: 'Slider',
            default: 25,
        },
        color: {
            type: 'string',
            title: 'Color',
            default: '#3b82f6',
        },
    },
};

const Demo = () => {

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Form Library Components Demo</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <CollectionForm schema={schema} id='demo-form' data={{}} />
            </div>
        </div>
    );
};

// Render the demo
const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(<Demo />);
}
