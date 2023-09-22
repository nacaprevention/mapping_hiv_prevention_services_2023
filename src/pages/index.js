import React from 'react';
import NationalMap from './NationalMap.js';
{
  /* The following line can be included in your src/index.js or App.js file */
}
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the HIV Prevention Services Map</h1>
      <NationalMap />
    </div>
  );
};

export default HomePage;
