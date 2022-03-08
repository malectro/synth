import React from 'react';
import Link from 'next/link';

import lessonCss from '../src/components/lessons/lesson.module.css';

import NoiseAndShapes from  '../src/components/lessons/lesson-2/noise-and-shapes.tsx';
import SimpleWaveforms from '../src/components/synths/simple-waveforms.jsx';
import FrequencyWaveform from '../src/components/synths/frequency-waveform.tsx';
import Analyser from '../src/components/synths/analyser.jsx'


export default function Lesson2() {
  return (
    <article className={lessonCss.article}>
      <section>
        <h1 className={lessonCss.title}>Fundamentals</h1>
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

      <section>
        <p>While we can play each waveform at a certain frequency, the story is actually much more complicated than that. Try playing a sine wave at different pitches, and, just as you’d expect, you’ll notice a very sharp spike in volume at that exact frequency.</p>
        <p>But switch to a square wave, and you’ll see that a bit more is going on. The loudest spike, called the “fundamental frequency” is still at the frequency that you played, but there are a few smaller spikes at higher pitches as well. We call these frequencies “overtones”. While the fundamental frequency gives a note its pitch, the overtones give it its character. (Musicians, taking a queue from creative writers, often substitute “character” for “timbre”, “color”, or “shape”; but they essentially mean the same thing.)</p>
        <p>Left bare, these waveforms can sound annoying and even abrasive – hardly useful as instruments. In the next lesson I’ll discuss the different ways to further shape them so that they appear more pleasing and organic.</p>
        <Link href="/3">Next</Link>
      </section>
    </article>
  );
}


