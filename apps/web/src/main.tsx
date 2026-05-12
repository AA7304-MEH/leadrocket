console.log('MAIN.TSX: BUNDLE STARTING');
import React from 'react'
import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import App from './App'
import './index.css'

const Root = () => {
  return (
    <App />
  );
};

const container = document.getElementById("root");
console.log('MAIN.TSX: CONTAINER FOUND?', !!container);
if (container) {
  console.log('MAIN.TSX: ATTEMPTING RENDER');
  createRoot(container).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
}
