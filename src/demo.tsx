import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppmintForm } from '.';


const schema = {

}

// Function to initialize the app
function initializeApp(container: HTMLElement, config: any) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AppmintForm {...(config)} />
    </React.StrictMode>
  );
}

// Expose the initialization function globally
(window as any).AppmintChatClient = {
  init: initializeApp
};
