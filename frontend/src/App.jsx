import React from 'react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Home />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A1A1D',
            color: '#fff',
            border: '2px solid #FF4500',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 'bold',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#0A0A0B',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#0A0A0B',
            },
          },
        }}
      />
    </>
  );
}

export default App;
