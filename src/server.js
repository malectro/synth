import path from 'path';
import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import App from './components/app.jsx';

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


app.get('/', (req, res) => {
  const html = renderToString(
    <App />
  );
  res.send(
`<!DOCTYPE html>
${html}`
  );
});


const server = app.listen(PORT, () => {
  const {host, port} = server.address();
  console.log(`App listening at http://${host}:${port}`);
});

