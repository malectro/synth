import React from 'react';
import {render} from 'react-dom';
import {Router, useRouterHistory, match} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import routes from './routes';

import App from './components/app.jsx';


const appHistory = useScroll(useRouterHistory(createBrowserHistory))();
const appElement = document.getElementById('app');

function init() {
  render((
    <Router routes={routes} history={appHistory} />
  ), appElement);
}

match({routes, location}, () => {
  init();
});

