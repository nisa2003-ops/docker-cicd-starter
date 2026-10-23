import React from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <AppStateProvider>
      <AppLayout />
    </AppStateProvider>
  );
}

export default App;
