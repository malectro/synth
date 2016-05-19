/* @flow */

import _ from 'lodash';
import React, {Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import audio, {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';

import Spectrum from 'src/components/modules/analyser.jsx';
import Keyboard from 'src/components/modules/keyboard.jsx';
import WavePlot from 'src/components/modules/wave-plot.jsx';


export default class Module extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.state = {
      osc: null,
      gain: null,
      waveType: 'sine',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyRelease = this.handleKeyRelease.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  componentDidMount() {
    const osc = audio.createOscillator();
    osc.frequency.value = 440;
    osc.type = this.state.waveType;

    const gain = audio.createGain();
    gain.gain.value = 0;

    osc.connect(gain);

    gain.connect(audio.destination);

    osc.start();

    this.setState({
      osc, gain,
    });
  }

  componentWillUnmount() {
    const {osc, gain} = this.state;
    osc.stop();
    osc.disconnect();
    gain.disconnect();
  }

  render() {
    const currentType = this.state.osc && this.state.osc.type;
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <Spectrum className={css.spectrum} source={this.state.gain} />
          <Keyboard onPress={this.handleKeyPress} onRelease={this.handleKeyRelease} />
          <div className={css.waveSelect}>
            { ['sine', 'sawtooth', 'triangle', 'square'].map(type => (
              <WavePlot className={currentType === type ? css.waveSelected : css.wave} type={type} repeat={0.5} onClick={() => this.handleTypeChange(type)} />
            )) }
          </div>
          <figcaption>A frequency spectrum shows us the “loudness” of a sound at every audible frequency.</figcaption>
        </div>
      </figure>
    );
  }

  handleKeyPress(freq) {
    const now = audio.currentTime;
    this.state.osc.frequency.linearRampToValueAtTime(freq, now + 0.01);
    this.state.gain.gain.linearRampToValueAtTime(0.8, now + 0.2);
  }

  handleKeyRelease(freq) {
    const now = audio.currentTime;
    this.state.gain.gain.linearRampToValueAtTime(0, now + 0.2);
  }

  handleTypeChange(waveType) {
    const {osc} = this.state;
    osc.type = waveType;
    console.log('changing', waveType);
    this.setState({osc, waveType});
  }
}

