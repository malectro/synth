import React from 'react';

import lessonCss from './lesson.css';

import Noise from 'src/components/synths/noise.jsx';
import NoiseLooped from 'src/components/synths/noise-looped.jsx';


export default function Lesson1() {
  return (
    <article className={lessonCss.article}>
      <section>
        <h1 className={lessonCss.title}>Sound and Fury</h1>

        <blockquote>
          <dfn>noise</dfn> /noiz/ <em>noun</em>:
          <ol>
            <li>a sound, especially one that is loud or unpleasant or that causes disturbance.</li>
            <li><em>(technical)</em> irregular fluctuations that accompany a transmitted electrical signal but are not part of it and tend to obscure it.</li>
          </ol>
        </blockquote>

        <p>We often use the terms “noise” and “sound” interchangeably, but in a technical sense a sound can hold some kind of pattern that reveals its origin. A noise, on the other hand, can be disturbing because it signifies nothing. You can guess (often without thinking) what a rooster’s crow means and where it comes from, but when a loud, muffled noise hits the ceiling of your apartment all you really have to go on is the volume and the location. It was loud, and it was upstairs. It’s likely that your neighbor dropped something, but anything beyond that would be a guess.</p>

        <p>True noise, then, is similar to audible entropy. As a sound gets noisier, it tends to lose meaning, but I’d stop far short of calling noise annoying. Our brains spend every possible second analyzing the patterns decoded by our ears (among other things), but when given constant, near-pure noise those same neurons seem to take a break, which is why many people use things like fans, skymall-ish noise makers, and beach houses as sleep aids.</p>

        <p>Here’s a graph of some noise your computer just generated. You’ve probably seen something like this before in an audio player, but if you haven’t you can imagine the left side being the start of the sound and the right side being the end with all the bars indicating its volume at any given time. Because it’s noise, you shouldn’t be able to find a pattern. (i.e. Looking at the first half shouldn’t tell you anything about the second half.) When you’re ready, make sure your computer’s volume pretty low and hit “play”. You should hear what you’re seeing.</p>
      </section>

      <Noise />

      <section>
        <p>But what if knowing the first half did help us predict the second half? It might look something like this.</p>
      </section>

      <NoiseLooped />

      <section>
        <p>Try listening to it a couple times and see if you can hear it repeat. At the very least it should sound less uniform than the previous spout of noise – kindof like it’s rotating around and around. If you can’t hear anything strange, that’s fine too. The next example will make it easier.</p>
      </section>
    </article>
  );
}

