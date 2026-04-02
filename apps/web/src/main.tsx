import { createRoot } from 'react-dom/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import App from './App'
import './index.css'

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <App />
    </PayPalScriptProvider>
  );
}
