import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from 'src/components/app.jsx';
import Lesson1 from 'src/components/lessons/lesson-1.jsx';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Lesson1} />
  </Route>
);

