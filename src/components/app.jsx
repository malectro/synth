import React from 'react';

import './base.global.css';
import appCss from './app.css';
import Lesson1 from './lessons/lesson-1.jsx';


export default function App() {
  return (
    <html className={appCss.top}>
      <head>
        <title>Synth</title>
      </head>
      <body className={appCss.top}>
        <Lesson1 />
        <script src="/static/vendor.js"></script>
        <script src="/static/main.js"></script>
      </body>
    </html>
  );
}

