import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppmintForm } from '@appmint/form';

// Simple form schema for testing
const formSchema = {
  title: "Test Form",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Name",
      description: "Enter your full name"
    },
    email: {
      type: "string",
      title: "Email",
      format: "email",
      description: "Enter your email address"
    },
    age: {
      type: "number",
      title: "Age",
      minimum: 0,
      maximum: 120
    },
    message: {
      type: "string",
      title: "Message",
      description: "Enter your message",
      multiline: true
    }
  },
  required: ["name", "email"]
};

// Initial form data
const initialData = {
  name: "",
  email: "",
  age: 30,
  message: ""
};

const App = () => {
  const [formData, setFormData] = React.useState(initialData);

  const handleDataChange = (path: string, value: any, data: any, files: any, error: any) => {
    console.log("Form data changed:", { path, value, data, files, error });
    setFormData(data);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Appmint Form Demo</h1>
      <AppmintForm
        initData={formData}
        schema={formSchema}
        rules={{}}
        theme={{}}
        datatype="form"
        id="test-form"
        onChange={handleDataChange}
      />

      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
        <h3>Current Form Data:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
