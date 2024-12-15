import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import axios from 'axios';

// Enable sending cookies with cross-site requests
axios.defaults.withCredentials = true;

// Get the root DOM element where the React app will be mounted
const container = document.getElementById('root');

// Create a React root for the container
const root = createRoot(container);

// Render the App component inside the root element
root.render(<App />);