/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import css from './synth.module.css';

import SimpleWaveform from './simple-waveform.tsx';


export default () => (
  <figure className={css.simpleModule}>
    <div className={css.container}>
      <div className={css.row}>
        <div className={css.quad}>
          <SimpleWaveform type="square" />
        </div>
        <div className={css.quad}>
          <SimpleWaveform type="sine" />
        </div>
      </div>
      <div className={css.row}>
        <div className={css.quad}>
          <SimpleWaveform type="triangle" />
        </div>
        <div className={css.quad}>
          <SimpleWaveform type ="sawtooth" />
        </div>
      </div>
      <figcaption>From top-left to bottom-right: square wave, sine wave, triangle wave, and sawtooth wave</figcaption>
    </div>
  </figure>
);

