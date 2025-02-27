# AppmintForm

[![npm version](https://img.shields.io/npm/v/@appmint/form.svg)](https://www.npmjs.com/package/@appmint/form)
[![npm downloads](https://img.shields.io/npm/dm/@appmint/form.svg)](https://www.npmjs.com/package/@appmint/form)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

AppmintForm is a powerful, lightweight, and flexible form builder library for React applications, designed to make it easy to create and manage complex forms with minimal code while maintaining excellent performance and aesthetics.

## 📚 Documentation

**[View the comprehensive documentation](./DOCUMENTATION.md)** for detailed information on installation, usage, API reference, examples, and more.

## ✨ Features

- **JSON Schema Configuration**: Define forms using a declarative JSON schema
- **Rich Component Library**: Support for 30+ input types and controls
- **Conditional Rendering**: Show/hide fields based on form data
- **Built-in Validation**: Comprehensive validation using Zod
- **Customizable Layouts**: Multiple layout options including tabs, accordions, and more
- **Theming Support**: Easily customize the appearance of your forms
- **Performance Optimized**: Only updates what has changed, ensuring efficient rendering
- **Extensible**: Add custom input components and layouts

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @appmint/form

# Using yarn
yarn add @appmint/form

# Using pnpm
pnpm add @appmint/form
```

### Basic Usage

```jsx
import React from 'react';
import { AppmintForm } from '@appmint/form';

const MyForm = () => {
  const schema = {
    type: 'object',
    title: 'User Information',
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
      id="user-form"
    />
  );
};
```

## 🤝 Contributing

We welcome contributions from the community! To contribute to AppmintForm:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Write your code, making sure to follow the existing code style
4. Add or update tests if necessary
5. Update documentation for any new features
6. Submit a pull request

## 📄 License

AppmintForm is open-source software licensed under the [MIT license](https://github.com/durubata/appmint-form/blob/main/LICENSE).
