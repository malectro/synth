import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory, match} from 'react-router';

import routes from './routes';

import App from './components/app.jsx';


/*
window.process = {
  env: {
    NODE_ENV: 'development',
  },
};
*/

function init() {
  render((
    <Router routes={routes} history={browserHistory} />
  ), document);
}

match({routes, location}, () => {
  init();
});

