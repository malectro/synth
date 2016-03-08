import React from 'react';
import {render} from 'react-dom';
import App from './components/app.jsx';


const topElement = (
  <App />
);

const controller = render(topElement, document, () => {
  window.App = {
    controller,
  };

  console.log('App successfully attached and running.');
});


