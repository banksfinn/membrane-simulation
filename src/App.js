import React from 'react';
import './App.css';
import { MembraneAPI } from './MembraneComponents'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <div className="base-app">
        <MembraneAPI>temp</MembraneAPI>
      </div>
  );
}

export default App;
