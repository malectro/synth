import React from 'react';
import {render} from 'react-dom';
import {Router, userRouterHistory, match} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import routes from './routes';

import App from './components/app.jsx';


const appHistory = useScroll(useRouterHistory(createBrowserHistory))();

function init() {
  render((
    <Router routes={routes} history={appHistory} />
  ), document);
}

match({routes, location}, () => {
  init();
});

