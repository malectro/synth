import React from 'react';

import lessonCss from './lesson.css';

import NoiseAndShapes from  'src/components/lessons/lesson-2/noise-and-shapes.jsx';


export default function Lesson2() {
  return (
    <article className={lessonCss.article}>
      <section>
        <h1 className={lessonCss.title}>Fundamentels</h1>

        <p>Stuff</p>
      </section>

      <NoiseAndShapes />
    </article>
  );
}


