import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { PrivyProvider } from '@privy-io/react-auth';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID || 'your_privy_app_id_here'}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'apple', 'discord'],
        appearance: {
          theme: 'dark',
          accentColor: '#39FF14',
          showWalletLoginFirst: true,
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)
