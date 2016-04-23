/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';

import SoundPlayer from 'src/components/modules/player.jsx';


const noiseTime = 4;
const count = SAMPLE_RATE * noiseTime;
export default class Module extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    const points = _.times(count, i => ({
      x: i,
      y: Math.random() * 2 - 1,
    }));

    this.state = {
      points,
    };
  }

  render() {
    const {points} = this.state;
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <SoundPlayer points={points} duration={noiseTime} xyProps={{className: css.plot}} />
          <figcaption>Because this noise was generated randomly by your computer, we can safely assume it's never been seen before in the history of humanity.</figcaption>
        </div>
      </figure>
    );
  }
}

