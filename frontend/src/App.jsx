import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

function App() {
  console.log('App Rendering...');
  return (
    <BrowserRouter>
      {console.log('BrowserRouter active')}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
