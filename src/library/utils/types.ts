export enum DataType {
    form = 'form',
    collection = 'collection',
    // Add other data types as needed
}

export interface FileInfoSchema {
    type: string;
    format?: string;
    title?: string;
    description?: string;
}

export function FileInfoSchema(): FileInfoSchema {
    return {
        type: 'object',
        title: 'File',
        description: 'File information'
    };
}

export interface BaseModelDTO<T> {
    data: T;
    // Add other properties as needed
}

// Country data functions
export function getCountryDropDownOptions() {
    return [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' },
        // Add more countries as needed
    ];
}

export function getCountryRegions(countryCode: string) {
    if (countryCode === 'us') {
        return [
            { value: 'al', label: 'Alabama' },
            { value: 'ak', label: 'Alaska' },
            // Add more US states as needed
        ];
    } else if (countryCode === 'ca') {
        return [
            { value: 'ab', label: 'Alberta' },
            { value: 'bc', label: 'British Columbia' },
            // Add more Canadian provinces as needed
        ];
    } else if (countryCode === 'uk') {
        return [
            { value: 'eng', label: 'England' },
            { value: 'sct', label: 'Scotland' },
            // Add more UK regions as needed
        ];
    }
    return [];
}

export const themeSettingsList = [
    { name: 'light', description: 'Light theme' },
    { name: 'dark', description: 'Dark theme' },
    { name: 'system', description: 'System theme' },
    // Add more theme settings as needed
];
