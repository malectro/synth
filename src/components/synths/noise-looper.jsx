/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';

import SoundPlayer from 'src/components/modules/buffer-player.jsx';
import Slider from 'src/components/ui/slider.jsx';


const noiseTime = 1;
const maxCount = SAMPLE_RATE * noiseTime;
const maxSlide = Math.floor(Math.sqrt(maxCount));
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
      loopSize: maxSlide,
    };

    this.handleLoopSizeChange = this.handleLoopSizeChange.bind(this);
  }

  render() {
    const {loopSize} = this.state;
    const slicePoint = Math.pow(loopSize, 2);
    const points = this.state.points.slice(0, slicePoint);
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <SoundPlayer points={points} duration={noiseTime} loop={true} xyProps={{className: css.plot}} />
          <Slider className={css.slider} max={maxSlide} value={loopSize} onChange={this.handleLoopSizeChange} />
          <figcaption>Slowly drag the blue slider to the left to shorten the loop.</figcaption>
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

