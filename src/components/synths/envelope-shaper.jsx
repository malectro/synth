/* @flow */

import React, {Component} from 'react';

import audio, {SAMPLE_RATE} from 'src/audio';
import css from './synth.css';

import Envelope from 'src/components/modules/envelope.jsx';
import Keyboard from 'src/components/modules/keyboard.jsx';
import WavePlot from 'src/components/modules/wave-plot.jsx';


export default class EnvelopeShaper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      osc: null,
      gain: null,
      waveType: 'sine',
    };
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

  render() {
    const currentType = this.state.osc && this.state.osc.type;
    return (
      <figure className={css.module}>
        <div className={css.container}>
          <Envelope />
          <Keyboard onPress={this.handleKeyPress} onMove={this.handleKeyMove} onRelease={this.handleKeyRelease} />
          <div className={css.waveSelect}>
            { ['sine', 'sawtooth', 'triangle', 'square'].map(type => (
              <WavePlot className={currentType === type ? css.waveSelected : css.wave} key={type} type={type} repeat={0.5} onClick={() => this.handleTypeChange(type)} />
            )) }
          </div>
          <figcaption>A frequency spectrum shows us the “loudness” of a sound at every audible frequency.</figcaption>
        </div>
      </figure>
    );
  }
}

