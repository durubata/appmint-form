import React from 'react';
import CollectionForm from '../../library/form-view';

const schema = {
    type: 'object',
    properties: {
        paragraph: {
            type: 'null',
            title: 'Paragraph',
            description: 'Static paragraph text element',
            'x-control': 'paragraph',
            'x-content': 'This is a static paragraph element that displays text without any input controls.'
        },
        label: {
            type: 'null',
            title: 'Label',
            description: 'Static label element',
            'x-control': 'label',
            'x-content': 'This is a static label element'
        },
        notice: {
            type: 'null',
            title: 'Notice',
            description: 'Notification or alert element',
            'x-control': 'notice',
            'x-content': 'This is an important notice that stands out to the user.',
            'x-notice-type': 'info' // Can be info, warning, error, success
        },
        button: {
            type: 'null',
            title: 'Button',
            description: 'Clickable button element',
            'x-control': 'button',
            'x-button-text': 'Click Me',
            'x-button-action': 'console.log("Button clicked")'
        },
        collapsible: {
            type: 'object',
            title: 'Collapsible Section',
            description: 'Expandable/collapsible section',
            collapsible: true,
            properties: {
                collapsibleContent: {
                    type: 'string',
                    title: 'Content inside collapsible',
                    default: 'This content is inside a collapsible section'
                }
            }
        }
    }
};

const LayoutElementsDemo: React.FC = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <CollectionForm
                schema={schema}
                id='layout-elements-demo'
                data={{}}
            />
        </div>
    );
};

export default LayoutElementsDemo;
