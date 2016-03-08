import React from 'react';

import Lesson1 from './lesson-1.jsx';


export default function App() {
  return (
    <html>
      <head>
        <title>Synth</title>
      </head>
      <body>
        <Lesson1 />
        <script src="/static/vendor.js"></script>
        <script src="/static/main.js"></script>
      </body>
    </html>
  );
}

