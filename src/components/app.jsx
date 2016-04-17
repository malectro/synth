/* @flow */

import React from 'react';

import './base.global.css';
import appCss from './app.css';
import Lesson1 from './lessons/lesson-1.jsx';


type Props = {
  children: Object[],
};

export default function App({children}: Props) {
  return (
    <html className={appCss.top}>
      <head>
        <title>Synth</title>
      </head>
      <body className={appCss.top}>
        {children}
        <script src="/static/vendor.js"></script>
        <script src="/static/main.js"></script>
      </body>
    </html>
  );
}

