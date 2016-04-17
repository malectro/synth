import path from 'path';
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';

import routes from './routes';
//import App from './components/app.jsx';

/*
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import counterApp from './reducers';
import App from './containers/App';
*/


const DEVELOPMENT = process.env.NODE_ENV === 'development';
const HOT_MODULE_REPLACEMENT = DEVELOPMENT && process.env.HMR;


const app = express();
const PORT = process.env.PORT || 3001;

app.set('port', PORT);

app.use('/images', express.static(__dirname + '/images'));

if (!HOT_MODULE_REPLACEMENT) {
  app.use('/static', express.static('build/client'));
}


app.get('*', (req, res) => {
  const location = req.url;
  match({routes, location}, (error, redirect, renderProps) => {
    if (error) {
      res.status(500).send(error.message);

    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);

    } else if (renderProps) {
      const html = renderToString(
        <RouterContext {...renderProps} />
      );
      res.send(
`<!DOCTYPE html>
${html}`
      );
    } else {
      console.log('404', location);
      res.status(404).send('Not found');
    }
  });
});


const server = app.listen(PORT, () => {
  const {host, port} = server.address();
  console.log(`App listening at http://${host}:${port}`);
});

