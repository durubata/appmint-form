# AppmintForm

AppmintForm is a powerful, lightweight, and flexible form builder library for React applications, designed to make it easy to create and manage complex forms with minimal code while maintaining excellent performance and aesthetics.

## Motivation

The main motivation behind AppmintForm is to simplify form creation and management in React applications. We aim to provide a highly customizable and easy-to-use solution that can handle complex form structures, dynamic rendering, and validation with minimal effort from developers, all while being lightweight and performance-oriented.

## Features

- Intuitive form configuration using JSON schema
- Support for various input types and controls
- Conditional rendering based on form data
- Built-in form validation
- Customizable layouts and theming
- Support for array and nested objects
- Extensibility through custom input components and layouts
- Performance: Only updates what has changed, ensuring efficient rendering
- Lightweight design with a focus on aesthetics

## Installation

To install AppmintForm, run the following command in your project's root directory:

```bash
npm install @appmint/form

or

yarn add @appmint/form

## Usage
To use AppmintForm in your React application, simply import the main AppmintForm component and pass the JSON schema and initial form data as props:

```jsx
import React from 'react';
import AppmintForm from '@appmint/form';

const schema = {
  // Your JSON schema goes here
};

const initialData = {
  // Your initial form data goes here
};

const MyForm = () => {
  return <AppmintForm schema={schema} initialData={initialData} />;
};

export default MyForm;

```

## Roadmap

Our future goals and enhancements for AppmintForm include:

1. Support for additional layout types (e.g., grid layout, datatable)
2. Integration with popular form libraries (e.g., Formik, react-hook-form)
3. Improved performance and optimization techniques
4. Comprehensive documentation and examples
5. A set of pre-built themes for easy customization
6. Extending support for validation libraries

## Contributing

We welcome contributions from the community! To contribute to AppmintForm:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Write your code, making sure to follow the existing code style and conventions.
4. Add or update tests, if necessary.
5. Update documentation if you're introducing new features or making changes to the API.
6. Commit your changes and create a pull request.

For more detailed instructions on how to contribute, please see our [contributing guide](https://github.com/durubata/@appmint/form/blob/main/CONTRIBUTING.md).

## License

AppmintForm is open-source software licensed under the [MIT license](https://github.com/durubata/@appmint/form/blob/main/LICENSE).
