import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import serialize from 'serialize-javascript';

import routes from './routes';


const DEVELOPMENT = process.env.NODE_ENV === 'development';
const HOT_MODULE_REPLACEMENT = DEVELOPMENT && process.env.HMR;


const app = express();
const PORT = process.env.PORT || 3001;

app.set('port', PORT);

app.set('views', 'src/views');
app.set('view engine', 'pug');

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
      const content = renderToString(
        <RouterContext {...renderProps} />
      );
      const data = serialize({});
      res.render('index', {
        content,
        data,
        development: DEVELOPMENT,
        base: HOT_MODULE_REPLACEMENT ? 'http://localhost:8080' : '',
      });
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

