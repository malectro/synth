/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';

import SoundPlayer from 'src/components/modules/player.jsx';
import Slider from 'src/components/ui/slider.jsx';


const noiseTime = 2;
const maxCount = SAMPLE_RATE * noiseTime;
export default class Module extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    const points = _.times(maxCount, i => ({
      x: i,
      y: Math.random() * 2 - 1,
    }));

    this.state = {
      points: points,
      loopSize: maxCount,
    };

    this.handleLoopSizeChange = this.handleLoopSizeChange.bind(this);
  }

  render() {
    const {loopSize} = this.state;
    const points = this.state.points.slice(0, loopSize);
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <SoundPlayer points={points} duration={noiseTime} repeatPlotAt={100} />
          <Slider max={maxCount} value={loopSize} onChange={this.handleLoopSizeChange} />
          <figcaption>Incidentally, this noise is probably also unique.</figcaption>
        </div>
      </figure>
    );
  }

  handleLoopSizeChange(size) {
    this.setState({
      loopSize: size,
    });
  }
}

