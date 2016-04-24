import React from 'react';

import lessonCss from './lesson.css';

import NoiseAndShapes from  'src/components/lessons/lesson-2/noise-and-shapes.jsx';
import SimpleWaveforms from 'src/components/synths/simple-waveforms.jsx';


export default function Lesson2() {
  return (
    <article className={lessonCss.article}>
      <section>
        <h1 className={lessonCss.title}>Fundamentels</h1>
        <p>Even though all that noise was unique (in fact, refreshing lesson 1 will give you completely unique noise each time), it doesn’t end up sounding very special. The total randomness that gives noise its sound also gives it its sameness. To get tones to sound audibly different, we often have to make them visibly different as well.</p>
      </section>

      <NoiseAndShapes />

      <section>
        <p>From a purely informational perspective, blocks of noise hold a lot more information than shapes. (They literally take up more space on a hard drive.) But from a human perspective they provide almost no information. Blur your eyes, and they look gray.</p>
        <p>In computer graphics the pure, preschool shapes like circles and squares are called “primitives”. Audio has similar “shapes” it calls “common waveforms” that are often used as the building blocks of more complex sounds.</p>
      </section>

      <SimpleWaveforms />

      <section>
        <p>The module above will allow you to play any of the four basic waveforms. Of the four, the sine wave is the most organic – it sounds a lot like an organ or a flute. The square wave, being kindof pixelated, sounds a bit like a Game Boy, and the saw wave is frequently described as “fat”.</p>
      </section>
    </article>
  );
}


