import React from 'react';

import lessonCss from './lesson.css';

import NoiseAndShapes from  'src/components/lessons/lesson-2/noise-and-shapes.jsx';
import SimpleWaveforms from 'src/components/synths/simple-waveforms.jsx';
import FrequencyWaveform from 'src/components/synths/frequency-waveform.jsx';
import Analyser from 'src/components/synths/analyser.jsx'


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

      <FrequencyWaveform />

      <section>
        <p>And by changing the speed (or frequency) at which we play these waves, we change the audible pitch. Musicians call pitches by letter names that correspond to keys on a piano, and incidentally there is a mathematical reason for why these letters repeat. As you climb a piano, each C note is double the frequency of the previous.</p>
        <p>To really understand why these waves sound the way they do, it helps to look at a “frequency spectrum”.</p>
      </section>

      <Analyser />
    </article>
  );
}


