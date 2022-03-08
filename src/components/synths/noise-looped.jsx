/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';

import {SAMPLE_RATE} from '../../audio.ts';
import css from './synth.module.css';

import SoundPlayer from '../modules/buffer-player.tsx';


const noiseTime = 2;
const count = SAMPLE_RATE * noiseTime;
export default class Module extends Component {
  constructor(props) {
    super(props);

    const halfCount = Math.floor(count / 2);
    const points = _.times(halfCount, i => ({
      x: i,
      y: Math.random() * 2 - 1,
    }));

    this.state = {
      points: points.concat(points),
    };
  }

  render() {
    const {points} = this.state;
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <SoundPlayer points={points} duration={noiseTime} repeatPlotAt={100} xyProps={{className: css.plot}} />
          <figcaption>Incidentally, this noise is probably also unique.</figcaption>
        </div>
      </figure>
    );
  }
}

