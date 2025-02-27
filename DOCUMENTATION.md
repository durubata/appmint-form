# AppmintForm Documentation

AppmintForm is a powerful, lightweight, and flexible form builder library for React applications. It allows developers to create complex forms with minimal code while maintaining excellent performance and aesthetics.

[![npm version](https://img.shields.io/npm/v/@appmint/form.svg)](https://www.npmjs.com/package/@appmint/form)
[![npm downloads](https://img.shields.io/npm/dm/@appmint/form.svg)](https://www.npmjs.com/package/@appmint/form)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Form Schema Structure](#form-schema-structure)
- [Form Elements](#form-elements)
- [Layout Options](#layout-options)
- [Validation](#validation)
- [Theming](#theming)
- [API Reference](#api-reference)
- [Common Threads](#common-threads)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Introduction

AppmintForm simplifies form creation and management in React applications. It provides a highly customizable and easy-to-use solution that can handle complex form structures, dynamic rendering, and validation with minimal effort from developers, all while being lightweight and performance-oriented.

### Key Features

- **JSON Schema Configuration**: Define forms using a declarative JSON schema
- **Rich Component Library**: Support for 30+ input types and controls
- **Conditional Rendering**: Show/hide fields based on form data
- **Built-in Validation**: Comprehensive validation using Zod
- **Customizable Layouts**: Multiple layout options including tabs, accordions, and more
- **Theming Support**: Easily customize the appearance of your forms
- **Performance Optimized**: Only updates what has changed, ensuring efficient rendering
- **Extensible**: Add custom input components and layouts

## Installation

To install AppmintForm, run one of the following commands in your project's root directory:

```bash
# Using npm
npm install @appmint/form

# Using yarn
yarn add @appmint/form

# Using pnpm
pnpm add @appmint/form
```

### Requirements

- React 18 or higher
- Node.js 18 or higher

## Basic Usage

Here's a simple example of how to use AppmintForm in your React application:

```jsx
import React from 'react';
import { AppmintForm } from '@appmint/form';

const MyForm = () => {
  // Define your form schema
  const schema = {
    type: 'object',
    title: 'User Information',
    properties: {
      firstName: {
        type: 'string',
        title: 'First Name',
        description: 'Enter your first name',
        inputRequired: true
      },
      lastName: {
        type: 'string',
        title: 'Last Name',
        description: 'Enter your last name',
        inputRequired: true
      },
      email: {
        type: 'string',
        title: 'Email',
        description: 'Enter your email address',
        format: 'email',
        inputRequired: true
      }
    }
  };

  // Initial form data (optional)
  const initialData = {
    firstName: '',
    lastName: '',
    email: ''
  };

  // Handle form changes
  const handleChange = (path, value, data, files, error) => {
    console.log('Form data changed:', data);
  };

  return (
    <AppmintForm 
      schema={schema} 
      initData={initialData} 
      onChange={handleChange}
      id="user-form"
    />
  );
};

export default MyForm;
```

## Form Schema Structure

AppmintForm uses a JSON schema to define the structure and behavior of your forms. The schema follows a structure similar to JSON Schema but with additional properties specific to AppmintForm.

### Basic Schema Structure

```json
{
  "type": "object",
  "title": "Form Title",
  "description": "Form description",
  "properties": {
    "fieldName": {
      "type": "string",
      "title": "Field Label",
      "description": "Field description",
      "inputRequired": true,
      "x-control": "text"
    }
  },
  "x-layout": {
    // Layout configuration
  }
}
```

### Schema Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | The data type of the form (usually "object") |
| `title` | string | The title of the form |
| `description` | string | The description of the form |
| `properties` | object | An object containing field definitions |
| `x-layout` | object | Layout configuration for the form |
| `pages` | array | For multi-page forms, an array of page objects |
| `theme` | object | Theme configuration for the form |
| `collapsible` | boolean | Whether the form can be collapsed |

### Field Properties

Each field in the `properties` object can have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | The data type of the field (string, number, boolean, array, object, null) |
| `title` | string | The label for the field |
| `description` | string | The description or help text for the field |
| `inputRequired` | boolean | Whether the field is required |
| `default` | any | The default value for the field |
| `x-control` | string | The type of control to use for the field |
| `x-control-variant` | string | A variant of the control |
| `placeholder` | string | Placeholder text for input fields |
| `enum` | array | For selection fields, an array of possible values |
| `minimum` | number | For number fields, the minimum allowed value |
| `maximum` | number | For number fields, the maximum allowed value |
| `minLength` | number | For string fields, the minimum allowed length |
| `maxLength` | number | For string fields, the maximum allowed length |
| `pattern` | string | For string fields, a regex pattern for validation |
| `format` | string | For string fields, a predefined format (e.g., "email", "date") |
| `validations` | array | Custom validation rules |
| `prefix` | string | Text to display before the input |
| `suffix` | string | Text to display after the input |
| `disabled` | boolean | Whether the field is disabled |
| `readOnly` | boolean | Whether the field is read-only |
| `hidden` | boolean | Whether the field is hidden |
| `layoutGroup` | string | The layout group the field belongs to |

## Form Elements

AppmintForm provides a wide range of form elements to handle different types of data and user interactions.

### Text Inputs

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `text` | Basic text input | `{ "type": "string" }` |
| `textarea` | Multi-line text input | `{ "type": "string", "x-control-variant": "textarea" }` |
| `email` | Email input with validation | `{ "type": "string", "format": "email", "x-control": "email" }` |
| `richtext` | Rich text editor with formatting | `{ "type": "string", "x-control": "richtext" }` |
| `markdown` | Markdown editor | `{ "type": "string", "x-control": "markdown" }` |
| `code` | Code editor | `{ "type": "string", "x-control": "code" }` |

### Number Inputs

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `number` | Basic number input | `{ "type": "number" }` |
| `slider` | Slider for selecting a number | `{ "type": "number", "x-control-variant": "slider" }` |
| `numberrange` | Range of numbers | `{ "type": "object", "x-control": "numberrange" }` |

### Selection Inputs

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `selectsingle` | Single selection dropdown | `{ "type": "string", "enum": ["Option 1", "Option 2"] }` |
| `selectmany` | Multiple selection control | `{ "type": "array", "items": { "type": "string", "enum": ["Option A", "Option B"] }, "x-control": "selectmany" }` |
| `rating` | Star rating input | `{ "type": "number", "x-control": "rating" }` |
| `ranking` | Drag-and-drop ranking | `{ "type": "array", "x-control": "ranking" }` |

### Date and Time Inputs

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `date` | Date picker | `{ "type": "string", "format": "date", "x-control": "date" }` |
| `daterange` | Date range picker | `{ "type": "object", "x-control": "daterange" }` |
| `cron` | Cron expression editor | `{ "type": "string", "x-control": "cron" }` |

### Special Inputs

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `color` | Color picker | `{ "type": "string", "x-control": "color" }` |
| `file` | File upload | `{ "type": "string", "x-control": "file" }` |
| `map` | Map location picker | `{ "type": "object", "x-control": "map" }` |
| `phone` | Phone number input | `{ "type": "string", "x-control": "phone" }` |
| `icon` | Icon picker | `{ "type": "string", "x-control": "icon" }` |
| `uuid` | UUID generator | `{ "type": "string", "x-control": "uuid" }` |
| `sociallinks` | Social media links | `{ "type": "object", "x-control": "sociallinks" }` |
| `legalconsent` | Legal consent checkbox | `{ "type": "boolean", "x-control": "legalconsent" }` |

### Layout Elements

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `paragraph` | Static text display | `{ "type": "null", "x-control": "paragraph", "x-content": "Text content" }` |
| `label` | Label element | `{ "type": "null", "x-control": "label" }` |
| `button` | Button element | `{ "type": "null", "x-control": "button" }` |
| `preview` | Preview of other content | `{ "type": "null", "x-control": "preview" }` |
| `shadow` | Shadow DOM element | `{ "type": "null", "x-control": "shadow" }` |

### Advanced Elements

| Element | Description | Schema Configuration |
|---------|-------------|---------------------|
| `dataview` | Data view component | `{ "type": "array", "x-control": "dataview" }` |
| `lookup` | Data lookup combo | `{ "type": "string", "x-control": "lookup" }` |
| `generated` | AI-generated content | `{ "type": "string", "x-control": "generated" }` |

## Layout Options

AppmintForm provides several layout options to organize your form fields.

### Basic Layout

By default, form fields are displayed in a vertical stack. You can customize this using the `x-layout` property in your schema.

### Tab Layout

```json
{
  "x-layout": {
    "main": {
      "type": "tab",
      "id": "main",
      "items": [
        { "id": "personal-info", "title": "Personal Information" },
        { "id": "contact-info", "title": "Contact Information" }
      ]
    }
  },
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First Name",
      "layoutGroup": "x-layout.main.items.0"
    },
    "email": {
      "type": "string",
      "title": "Email",
      "layoutGroup": "x-layout.main.items.1"
    }
  }
}
```

### Accordion Layout

```json
{
  "x-layout": {
    "main": {
      "type": "accordion",
      "id": "main",
      "items": [
        { "id": "personal-info", "title": "Personal Information" },
        { "id": "contact-info", "title": "Contact Information" }
      ]
    }
  }
}
```

### Slider Layout

```json
{
  "x-layout": {
    "main": {
      "type": "slider",
      "id": "main",
      "items": [
        { "id": "step1", "title": "Step 1" },
        { "id": "step2", "title": "Step 2" }
      ]
    }
  }
}
```

### Multi-Page Forms

For multi-page forms, use the `pages` property:

```json
{
  "type": "object",
  "title": "Multi-Page Form",
  "pages": [
    {
      "title": "Page 1",
      "properties": {
        "field1": {
          "type": "string",
          "title": "Field 1"
        }
      }
    },
    {
      "title": "Page 2",
      "properties": {
        "field2": {
          "type": "string",
          "title": "Field 2"
        }
      }
    }
  ],
  "theme": {
    "paging": "tab" // or "default" for next/back buttons
  }
}
```

## Validation

AppmintForm provides built-in validation using Zod. You can define validation rules in your schema using standard JSON Schema validation properties or custom validation rules.

### Standard Validation

```json
{
  "type": "string",
  "title": "Username",
  "minLength": 3,
  "maxLength": 20,
  "pattern": "^[a-zA-Z0-9_]+$",
  "inputRequired": true
}
```

### Custom Validation

```json
{
  "type": "string",
  "title": "Password",
  "validations": [
    {
      "validation": "regex",
      "arg": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$",
      "message": "Password must contain at least 8 characters, including uppercase, lowercase, and numbers"
    }
  ]
}
```

### Available Validation Types

- `required`: Field is required
- `min`: Minimum value (for numbers) or length (for strings)
- `max`: Maximum value (for numbers) or length (for strings)
- `regex`: Regular expression pattern
- `email`: Valid email format
- `url`: Valid URL format
- `equals`: Value equals the argument
- `notEquals`: Value does not equal the argument
- `contains`: Value contains the argument
- `notContains`: Value does not contain the argument
- `startsWith`: Value starts with the argument
- `endsWith`: Value ends with the argument

## Theming

AppmintForm supports theming to customize the appearance of your forms.

### Basic Theming

```jsx
const theme = {
  form: {
    className: 'bg-gray-50 p-4 rounded-lg shadow-sm'
  },
  title: {
    className: 'text-xl font-bold text-blue-600'
  },
  control: {
    className: 'mb-4'
  },
  label: {
    className: 'text-sm font-medium text-gray-700'
  },
  input: {
    className: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
  }
};

<AppmintForm schema={schema} theme={theme} />
```

### Element-Specific Theming

```jsx
const theme = {
  text: {
    className: 'border-blue-300 focus:ring-blue-500'
  },
  number: {
    className: 'border-green-300 focus:ring-green-500'
  }
};
```

## API Reference

### AppmintForm Component

```jsx
<AppmintForm
  initData={object}       // Initial form data
  rules={object}          // Form rules for conditional logic
  schema={object}         // Form schema
  theme={object}          // Theme configuration
  datatype={string}       // Data type identifier
  id={string}             // Unique identifier for the form
  onChange={function}     // Callback function for form changes
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `initData` | object | Initial form data |
| `rules` | object | Form rules for conditional logic |
| `schema` | object | Form schema definition |
| `theme` | object | Theme configuration |
| `datatype` | string | Data type identifier |
| `id` | string | Unique identifier for the form |
| `onChange` | function | Callback function for form changes: `(path, value, data, files, error) => void` |
| `readOnly` | boolean | Whether the form is read-only |
| `collapsible` | boolean | Whether the form can be collapsed |
| `icon` | string | Icon for the form (when collapsible) |

### AppmintTable Component

```jsx
<AppmintTable
  title={string}          // Table title
  rules={object}          // Table rules
  schema={object}         // Table schema
  datatype={string}       // Data type identifier
  description={string}    // Table description
  id={string}             // Unique identifier for the table
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Table title |
| `rules` | object | Table rules |
| `schema` | object | Table schema definition |
| `datatype` | string | Data type identifier |
| `description` | string | Table description |
| `id` | string | Unique identifier for the table |
| `data` | array | Table data |
| `columns` | array | Table columns |
| `filterPreset` | object | Preset filters |
| `filters` | object | Active filters |
| `accessMode` | string | Access mode |
| `inlineEdit` | boolean | Whether inline editing is enabled |
| `isDemo` | boolean | Whether the table is in demo mode |
| `onRowEvent` | function | Callback function for row events: `(event, rowId, row) => void` |
| `onTableEvent` | function | Callback function for table events: `(event, option, selected) => void` |
| `isLoading` | boolean | Whether the table is loading |
| `cellRenderers` | object | Custom cell renderers |
| `itemRenderer` | function | Custom item renderer |
| `options` | object | Table options |

## Common Threads

### Build Checks

AppmintForm uses several tools to ensure code quality and consistency:

#### ESLint

The project uses ESLint for static code analysis with the following configuration:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "@typescript-eslint/recommended"
  ],
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    // Custom rules
  }
}
```

To run ESLint:

```bash
npm run lint
```

#### TypeScript

The project uses TypeScript for type checking with the following configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Vitest

The project uses Vitest for unit testing:

```bash
npm test
```

#### Size Limit

The project uses Size Limit to control the size of the library:

```bash
npm run size
```

Current size limits:

- CJS bundle: 10 KB
- ES module: 10 KB

To analyze the bundle size:

```bash
npm run analyze
```

### Download Graphs

[![NPM Downloads](https://img.shields.io/npm/dm/@appmint/form.svg)](https://www.npmjs.com/package/@appmint/form)

You can view the download statistics for AppmintForm on [npm-stat.com](https://npm-stat.com/charts.html?package=%40appmint%2Fform).

### Contributors

AppmintForm is maintained by [Jac Light](https://github.com/jaclight) and the AppmintForm team.

To view all contributors:

```bash
git shortlog -sn
```

## Examples

### Basic Form

```jsx
import React from 'react';
import { AppmintForm } from '@appmint/form';

const BasicForm = () => {
  const schema = {
    type: 'object',
    title: 'Contact Form',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        inputRequired: true
      },
      email: {
        type: 'string',
        title: 'Email',
        format: 'email',
        inputRequired: true
      },
      message: {
        type: 'string',
        title: 'Message',
        'x-control-variant': 'textarea',
        inputRequired: true
      }
    }
  };

  const handleChange = (path, value, data) => {
    console.log('Form data:', data);
  };

  return (
    <AppmintForm
      schema={schema}
      onChange={handleChange}
      id="contact-form"
    />
  );
};

export default BasicForm;
```

### Multi-Page Form

```jsx
import React from 'react';
import { AppmintForm } from '@appmint/form';

const MultiPageForm = () => {
  const schema = {
    type: 'object',
    title: 'Registration Form',
    pages: [
      {
        title: 'Personal Information',
        properties: {
          firstName: {
            type: 'string',
            title: 'First Name',
            inputRequired: true
          },
          lastName: {
            type: 'string',
            title: 'Last Name',
            inputRequired: true
          }
        }
      },
      {
        title: 'Account Information',
        properties: {
          email: {
            type: 'string',
            title: 'Email',
            format: 'email',
            inputRequired: true
          },
          password: {
            type: 'string',
            title: 'Password',
            'x-control-variant': 'password',
            inputRequired: true
          }
        }
      }
    ],
    theme: {
      paging: 'tab'
    }
  };

  return (
    <AppmintForm
      schema={schema}
      id="registration-form"
    />
  );
};

export default MultiPageForm;
```

### Form with Conditional Logic

```jsx
import React from 'react';
import { AppmintForm } from '@appmint/form';

const ConditionalForm = () => {
  const schema = {
    type: 'object',
    title: 'Subscription Form',
    properties: {
      plan: {
        type: 'string',
        title: 'Subscription Plan',
        enum: ['free', 'basic', 'premium'],
        default: 'free'
      },
      paymentMethod: {
        type: 'string',
        title: 'Payment Method',
        enum: ['credit_card', 'paypal', 'bank_transfer'],
        default: 'credit_card',
        hidden: true
      },
      cardNumber: {
        type: 'string',
        title: 'Card Number',
        hidden: true
      }
    }
  };

  const rules = [
    {
      when: 'plan',
      is: value => value !== 'free',
      then: {
        paymentMethod: {
          hidden: false
        }
      }
    },
    {
      when: 'paymentMethod',
      is: 'credit_card',
      then: {
        cardNumber: {
          hidden: false
        }
      }
    }
  ];

  return (
    <AppmintForm
      schema={schema}
      rules={rules}
      id="subscription-form"
    />
  );
};

export default ConditionalForm;
```

## Troubleshooting

### Common Issues

#### Form Not Rendering

- Check that you've provided a valid schema
- Ensure that the schema has a `type` property set to `object`
- Verify that the `properties` object contains at least one field

#### Validation Not Working

- Make sure you've set `inputRequired: true` for required fields
- Check that your validation rules are correctly formatted
- Verify that you're using the correct validation types

#### Layout Issues

- Ensure that your `x-layout` configuration is correct
- Verify that your `layoutGroup` references match the items in your layout
- Check that you're using the correct layout type (tab, accordion, slider)

### Debugging

You can enable debug mode by setting the `debug` prop to `true`:

```jsx
<AppmintForm
  schema={schema}
  debug={true}
/>
```

This will log additional information to the console, including:

- Schema parsing
- Validation results
- Form state changes
- Layout rendering

## Contributing

We welcome contributions from the community! To contribute to AppmintForm:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Write your code, making sure to follow the existing code style and conventions.
4. Add or update tests, if necessary.
5. Update documentation if you're introducing new features or making changes to the API.
6. Commit your changes and create a pull request.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/durubata/appmint-form.git
cd appmint-form

# Install dependencies
yarn install

# Start the development server
yarn dev

# Run tests
yarn test

# Build the library
yarn build
```

### Code Style

The project uses ESLint and Prettier for code formatting. Make sure your code passes the linting checks:

```bash
yarn lint
```

### Testing

Write tests for your changes using Vitest:

```bash
yarn test
```

### Documentation

Update the documentation to reflect your changes. If you're adding new features, make sure to include examples of how to use them.

### Pull Request Process

1. Update the README.md or documentation with details of changes, if appropriate.
2. Update the CHANGELOG.md with details of changes.
3. The PR will be merged once it has been reviewed and approved by a maintainer.

---

## License

AppmintForm is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

Documentation created for AppmintForm v0.2.0
