import React from 'react';

import lessonCss from '../src/components/lessons/lesson.module.css';

import EQ3 from '../src/components/synths/eq-3.jsx';
import EnvelopeShaper from '../src/components/synths/envelope-shaper.jsx';


export default function Lesson() {
  return (
    <article className={lessonCss.article}>
      <section>
        <h1 className={lessonCss.title}>Feeding Filters</h1>
        <p>More than oscillators and envelopes, filters are probably the most accessible component of a common synthesizer. We regularly change the brightness and contrast on our photos, and most of us have fiddled with a 3-band EQ filter in a car stereo.</p>
        <p>“EQ”, a common acronym in audio filtering, stands for “equalizer”, and the 3 “bands” correspond to “low”, “middle”, and “high”. Cars, in an effort to improve the user experience, might call them “bass” or “treble”, but signal processors are a little more technical and a little less musical.</p>
      </section>

      <EQ3 />

      <section>
        <p>But even simpler than the EQ is a “pass filter”. Pass filters come in three flavors: low, high, and (confusingly) band, but they work slightly differently than EQs in that they are only intended to let more of a certain frequency range “pass” through to the speakers. This effectively means they never raise the volume of the income signal – only lower it.</p>
        <p>Take the low pass filter for example. It’s often represented by a curve showing the amount the volume (amplitude) is lowered over the frequency range. The lower frequencies are left untouched while the higher frequencies are forced down.</p>
      </section>

      <EnvelopeShaper />
    </article>
  );
}
