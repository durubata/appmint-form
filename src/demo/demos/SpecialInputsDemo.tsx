import React from 'react';
import CollectionForm from '../../library/form-view';

const schema = {
    type: 'object',
    properties: {
        color: {
            type: 'string',
            title: 'Color Picker',
            description: 'Color selection input',
            'x-control': 'color',
            default: '#3b82f6'
        },
        file: {
            type: 'string',
            title: 'File Upload',
            description: 'File upload input',
            'x-control': 'file'
        },
        shadow: {
            type: 'string',
            description: 'Shadow color picker',
            'x-control': 'shadow'
        },
        map: {
            type: 'object',
            title: 'Map Location',
            description: 'Map location picker',
            'x-control': 'map',
            properties: {
                lat: {
                    type: 'number',
                    title: 'Latitude',
                    default: 40.7128
                },
                lng: {
                    type: 'number',
                    title: 'Longitude',
                    default: -74.0060
                }
            }
        },
        phone: {
            type: 'string',
            title: 'Phone Number',
            description: 'International phone number input with country code',
            'x-control': 'phone',
            default: '+1 (555) 123-4567'
        },
        iconPicker: {
            type: 'string',
            title: 'Icon Picker',
            description: 'Icon selection input',
            'x-control': 'icon',
            default: 'home'
        },
        uuid: {
            type: 'string',
            title: 'UUID',
            description: 'Auto-generated UUID field',
            'x-control': 'uuid'
        },
        socialLinks: {
            type: 'object',
            title: 'Social Links',
            description: 'Social media links input',
            'x-control': 'sociallinks',
            properties: {
                facebook: {
                    type: 'string',
                    title: 'Facebook',
                    default: 'https://facebook.com/example'
                },
                twitter: {
                    type: 'string',
                    title: 'Twitter',
                    default: 'https://twitter.com/example'
                },
                linkedin: {
                    type: 'string',
                    title: 'LinkedIn',
                    default: 'https://linkedin.com/in/example'
                }
            }
        }
    }
};

const SpecialInputsDemo: React.FC = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <CollectionForm
                schema={schema}
                id='special-inputs-demo'
                data={{}}
            />
        </div>
    );
};

export default SpecialInputsDemo;
