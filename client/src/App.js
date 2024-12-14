import React from 'react';
import { GlobalProvider } from './components/context/GlobalState';

import Main from './components/Main'

function App() {
  return (
    <GlobalProvider>
      <Main />
    </GlobalProvider>
  );
}

export default App;