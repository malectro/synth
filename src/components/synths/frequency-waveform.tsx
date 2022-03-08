/* @flow */

import type {WaveType} from 'src/audio';

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {SAMPLE_RATE} from '../../audio.ts';
import css from './synth.module.css';

import SimpleWaveform from './simple-waveform.tsx';
import Slider from '../ui/slider.tsx';


const max = 1000;
const min = 10;

export default class Module extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  state: {
    type: WaveType,
    frequency: number,
  };

  constructor(props) {
    super(props);

    this.state = {
      type: 'sine',
      frequency: 220,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    const {frequency} = this.state;
    const repeat = 1 - (frequency - min) / (max - min);

    return (
      <figure className={css.freqModule}>
        <div className={css.container}>
          <SimpleWaveform type="sine" plotRepeat={repeat} frequency={frequency} />
          <div className={css.tics}>
            <div className={css.tic} style={{right: `${(880 - min) * 100 / (max - min)}%`}}>A5 880hz</div>
            <div className={css.tic} style={{right: `${(440 - min) * 100 / (max - min)}%`}}>A4 440hz</div>
            <div className={css.tic} style={{right: `${(220 - min) * 100 / (max - min)}%`}}>A3 220hz</div>
          </div>
          <Slider className={css.slider} value={repeat} max={1} min={0} onChange={this.handleChange} />
          <figcaption>Try dragging between A3 and A4 to hear how similar the tones are.</figcaption>
        </div>
      </figure>
    );
  }

  handleChange(value) {
    this.setState({
      frequency: (1 - value) * (max - min) + min,
    });
  }
}

