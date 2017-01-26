import React from 'react';

import lessonCss from './lesson.css';

import EnvelopeShaper from 'src/components/synths/envelope-shaper.jsx';


export default function Lesson() {
  return (
    <article className={lessonCss.article}>
      <section>
        <h1 className={lessonCss.title}>Envelopes</h1>
        <p>Think of three organic sounds. You probably thought of: two hands clapping, your father yelling at you, and the pluck of a heart string; which is convenient because they fall neatly into 3 common instrumental categories: percussion, wind, and string.</p>
        <p>We can differentiate these categories by describing their relative time frames. A clap is immediately loud but fades almost as quickly, and a plucked string is similar but takes much longer to go silent. Both of these sounds emphasize what’s called the “attack” (the beginning of the sound), but they decay differently.</p>
        <p>Sound designers like to draw an instrument’s loudness (amplitude) over time as a line graph, and up until now all the sounds we’ve played have looked like this:</p>
      </section>

      <EnvelopeShaper />

      <section>
        <p>But as luck would have it, this module lets you move the attack and decay points around. To make the synth sound “plucked” you can move the decay point all the way down and well to the right. A clap would have a shorter decay, but moving the decay point to the left isn’t quite going to do it. Another important thing about a clap (and a lot of percussion for that matter) is that it’s atonal (toneless) – just like noise. Switching the generator from sawtooth to noise should get you a lot closer.</p>
        <p>So what about wind instruments? They usually aren’t caused by smacking together of objects, and (with circular breathing*(actually a thing)) they can be sustained indefinitely. To imitate this, the next module has two more editable points: “sustain” and “release”.</p>
      </section>
    </article>
  );
}

