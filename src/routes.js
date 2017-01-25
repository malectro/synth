import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from 'src/components/app.jsx';
import Lesson1 from 'src/components/lessons/lesson-1.jsx';
import Lesson2 from 'src/components/lessons/lesson-2.jsx';
import Lesson3 from 'src/components/lessons/lesson-3.jsx';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={Lesson1} />
    <Route path="2" component={Lesson2} />
    <Route path="3" component={Lesson3} />
  </Route>
);

