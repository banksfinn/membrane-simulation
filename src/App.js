import React from 'react';
import './App.css';
import { SpotifyAPI } from './SpotifyComponents'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <div className="base-app">
        <SpotifyAPI>temp</SpotifyAPI>
      </div>
  );
}

export default App;
