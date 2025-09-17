import React from 'react';
import { createRoot } from 'react-dom/client';  // Updated import
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';
import App from './App';
import store  from './redux/store';
import { Provider } from 'react-redux';
import '../src/styles/custom.css';

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render your app
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Optional: Performance measurement
// reportWebVitals();