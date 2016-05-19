/* @flow */

import type {WaveType} from 'src/audio';

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import css from './synth.css';
import audio from 'src/audio';

import WavePlot from 'src/components/modules/wave-plot.jsx';
import SoundPlayer from 'src/components/modules/player.jsx';


const noiseTime = 4;
export default class SimpleWaveform extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  props: {
    type: WaveType,
    frequency: number,
    plotRepeat: number,
  };

  static defaultProps = {
    frequency: 300,
    plotRepeat: 0.5,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      this.player.refresh();
    }
  }

  componentDidUpdate() {
    if (this.source) {
      this.source.frequency.value = this.props.frequency;
    }
  }

  render() {
    return (
      <SoundPlayer duration={noiseTime} onGetSource={this.handleGetSource.bind(this)} loop={true} ref={el => this.player = el}>
        <WavePlot className={css.wave} type={this.props.type} repeat={this.props.plotRepeat} />
      </SoundPlayer>
    );
  }

  handleGetSource() {
    const source = this.source = audio.createOscillator();
    source.type = this.props.type;
    source.frequency.value = this.props.frequency;
    return source;
  }
}
