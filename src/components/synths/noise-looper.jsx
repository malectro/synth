/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';

import SoundPlayer from 'src/components/modules/player.jsx';


const noiseTime = 2;
const count = SAMPLE_RATE * noiseTime;
export default class Module extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

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
          <SoundPlayer points={points} duration={noiseTime} repeatPlotAt={100} />
          <figcaption>Incidentally, this noise is probably also unique.</figcaption>
        </div>
      </figure>
    );
  }
}

